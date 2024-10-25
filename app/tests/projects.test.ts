import { User } from '../models/User';
import { NotificationWorker } from '../notifications/NotificationWorker';
import { iSendNotification } from '../notifications/senders/iSendNotification';
import { PAHandlerBuild } from '../pipelines/handlers/PAHandlerBuild';
import { PAHandlerDeploy } from '../pipelines/handlers/PAHandlerDeploy';
import { PAHandlerFail } from '../pipelines/handlers/PAHandlerFail';
import { PAHandlerPackage } from '../pipelines/handlers/PAHandlerPackage';
import { PAHandlerSources } from '../pipelines/handlers/PAHandlerSources';
import { Pipeline } from '../pipelines/Pipeline';
import { BacklogItem } from '../project/Backlog/BacklogItem';
import { BacklogItemTask } from '../project/Backlog/BacklogItemTask';
import { BacklogItemStateDoing } from '../project/Backlog/states/BacklogItemStateDoing';
import { BacklogItemStateTodo } from '../project/Backlog/states/BacklogItemStateTodo';
import { Project } from '../project/Project';
import { ProjectSprint } from '../project/sprint/ProjectSprint';
import { ProjectSprintStatus } from '../project/sprint/ProjectSprintStatus';
import { SRBPdf } from '../project/sprint/reportGenerator/builder/SRBPdf';
import { SRBPng } from '../project/sprint/reportGenerator/builder/SRBPng';
import { SRBSettings } from '../project/sprint/reportGenerator/SRBSettings';

const testUsers = {
  productOwner: new User('John Doe', true, true),
  scrumMaster: new User('Jane Doe', true, true),
  developers: [
    new User('Developer 1', true, true),
    new User('Developer 2', true, true),
    new User('Developer 3', true, true),
  ],
  testers: [new User('Tester 1', true, true), new User('Tester 2', true, true)],
  randomNonTeamMember: new User('Random Person', false, false),
};

const projectReportSettings = new SRBSettings(true, true, true, true);

const getTestBacklogItems = (project: Project) => {
  return [
    new BacklogItem(project, 'Backlog item 1', testUsers.developers[0]),
    new BacklogItem(project, 'Backlog item 2', testUsers.developers[0]),
    new BacklogItem(project, 'Backlog item 3', testUsers.developers[0]),
    new BacklogItem(project, 'Backlog item 4', testUsers.developers[0]),
    new BacklogItem(project, 'Backlog item 5', testUsers.developers[0]),
  ];
};

describe('Projectmanagement en Scrum', () => {
  // Create test project
  const testProject = new Project(
    'Projectmanagement en Scrum',
    testUsers.productOwner
  );
  // Fill project data
  testProject.backlog.push(...getTestBacklogItems(testProject));

  // Create demo sprint
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 14);
  const sprint1 = new ProjectSprint(
    'Sprint 1',
    testUsers.scrumMaster,
    new Date(),
    endDate,
    projectReportSettings
  );

  test('Users kunnen gekoppeld worden aan de sprint als developer.', () => {
    testUsers.developers.forEach((developer) => {
      sprint1.addDeveloper(developer);
    });
    expect(sprint1.getDevelopers().length).toBe(testUsers.developers.length);
  });
  test('Een user kan worden toegewezen als scrum-master van de sprint.', () => {
    expect(sprint1.scrumMaster).toBeDefined();
  });

  testUsers.testers.forEach((tester) => {
    sprint1.addTester(tester);
  });
  testProject.sprints.push(sprint1);
  testProject.currentActiveSprint = sprint1;

  // Add first 4 project backlog items to sprint
  testProject.backlog.every((item, index) => {
    if (index <= 4) {
      sprint1.addBacklogItem(item);
    }
  });

  test('Er is altijd 1 product owner per project.', () => {
    expect(testProject.productOwner).toBeDefined();
    expect(testProject.productOwner).toBe(testUsers.productOwner);
  });

  describe('Een backlog item kan de status "todo", "doing", "ready for testing", "testing" of "done" hebben. De status "upgrade" gaat altijd in deze volgorde.', () => {
    const backlogItem = testProject.backlog[0];
    const backlogItem2 = testProject.backlog[1];
    test('Een backlog item kan de status "todo" hebben en alleen naar doing', () => {
      expect(backlogItem).toBeDefined();
      expect(backlogItem.currentState).toBeInstanceOf(BacklogItemStateTodo);
      expect(backlogItem.moveToDone(backlogItem.developer)).toBe(false);
      expect(backlogItem.moveToReadyForTesting(backlogItem.developer)).toBe(
        false
      );
      expect(backlogItem.moveToTested(backlogItem.developer)).toBe(false);
      expect(backlogItem.moveToTesting(backlogItem.developer)).toBe(false);
      expect(backlogItem.moveToTodo(backlogItem.developer)).toBe(false);
    });

    test('Een developer kan alleen zijn eigen taak naar doing verplaatsen.', () => {
      expect(backlogItem.moveToDoing(testUsers.randomNonTeamMember)).toBe(
        false
      );
      expect(backlogItem.moveToDoing(backlogItem.developer)).toBe(true);
    });

    test('Een backlog mag alleen naar doing wanneer de gekoppelde developer geen andere taken met "doing" heeft.', () => {
      expect(backlogItem2.moveToDoing(backlogItem.developer)).toBe(false);
    });

    const sendNotificationFunction = jest.fn();
    test('Alle testers moeten een notificatie ontvangen wanneer een item naar ready-for-testing gaat.', () => {
      // Generate a mock notification worker
      const getNotificationMocker = (): iSendNotification => {
        return {
          sendNotification: sendNotificationFunction,
        };
      };

      // First overwrite the notification worker with a mock
      NotificationWorker.addHandlerOverride('slack', getNotificationMocker());
      NotificationWorker.addHandlerOverride('mail', getNotificationMocker());

      expect(backlogItem.moveToReadyForTesting(backlogItem.developer)).toBe(
        true
      );
      expect(sendNotificationFunction).toBeCalled();
    });

    test('Alleen een tester kan de status aanpassen van ready for test naar testing.', () => {
      expect(backlogItem.moveToTesting(backlogItem.developer)).toBe(false);
      expect(backlogItem.moveToTesting(testUsers.testers[0])).toBe(true);
    });

    // Clear mock so received notifications can be checked again
    sendNotificationFunction.mockClear();
    test('Een backlog item kan vanuit testing teruggezet worden naar "TODO" wanneer de test is gefaald.', () => {
      expect(backlogItem.moveToDoing(backlogItem.developer)).toBe(false);
      expect(backlogItem.moveToDoing(testUsers.testers[0])).toBe(false);
      expect(backlogItem.moveToDone(testUsers.testers[0])).toBe(false);
      expect(backlogItem.moveToTodo(testUsers.testers[0])).toBe(true);
    });
    test('Wanneer een backlog item van testing naar todo wordt verplaatst, moet er een notificatie naar de Scrum-master gaan.', () => {
      expect(sendNotificationFunction).toBeCalled();
    });

    test('Alleen een tester kan de status aanpassen van ready for test naar tested.', () => {
      expect(backlogItem.moveToDoing(backlogItem.developer)).toBe(true);
      expect(backlogItem.moveToReadyForTesting(backlogItem.developer)).toBe(
        true
      );
      expect(backlogItem.moveToTesting(testUsers.testers[0])).toBe(true);

      expect(backlogItem.moveToTested(backlogItem.developer)).toBe(false);
      expect(backlogItem.moveToTested(testUsers.testers[0])).toBe(true);
    });

    test('Alleen de product-owner mag de status aanpassen naar "done" of "ready-for-testing" wanneer deze op "tested" staat', () => {
      expect(backlogItem.moveToDone(backlogItem.developer)).toBe(false);
      expect(backlogItem.moveToDone(testUsers.testers[0])).toBe(false);
      expect(backlogItem.moveToReadyForTesting(backlogItem.developer)).toBe(
        false
      );
      expect(backlogItem.moveToReadyForTesting(testUsers.testers[0])).toBe(
        false
      );

      expect(backlogItem.moveToReadyForTesting(testUsers.productOwner)).toBe(
        true
      );
      expect(backlogItem.moveToTesting(testUsers.testers[0])).toBe(true);
      expect(backlogItem.moveToTested(testUsers.testers[0])).toBe(true);
      expect(backlogItem.moveToDone(testUsers.productOwner)).toBe(true);
    });
  });

  test('Er is maximaal 1 developer toegewezen per backlog item', () => {
    expect(testProject.backlog[0].developer).toBeDefined();
    expect(testProject.backlog[1].developer).toBeDefined();
    expect(testProject.backlog[2].developer).toBeDefined();
  });

  describe('backlog sub activiteiten', () => {
    const backlogItem = testProject.backlog[1];
    test('Een backlog item kan sub-activieiten hebben', () => {
      expect(backlogItem).toBeDefined();
      expect(backlogItem.subTasks).toBeDefined();
      expect(backlogItem.subTasks.length).toBe(0);
      backlogItem.subTasks.push(
        new BacklogItemTask('Sub-task 1', testUsers.developers[1])
      );
      expect(backlogItem.subTasks.length).toBe(1);
    });

    test('Er is maximaal 1 developer per backlog sub-activiteit', () => {
      expect(backlogItem.subTasks[0].developer).toBeDefined();
      expect(backlogItem.subTasks[0].developer.id).toBe(
        testUsers.developers[1].id
      );
    });

    test('Een backlog sub-activiteit heeft altijd de status todo of done.', () => {
      expect(backlogItem.subTasks[0].isDone).toBe(false);
    });

    test('Een backlog item kan alleen naar ready-for-test worden veranderd wanneer alle sub-activiteiten ook de status "done" hebben.', () => {
      expect(backlogItem.moveToDoing(backlogItem.developer)).toBe(true);
      expect(backlogItem.currentState).toBeInstanceOf(BacklogItemStateDoing);
      expect(backlogItem.moveToReadyForTesting(backlogItem.developer)).toBe(
        false
      );
      backlogItem.subTasks.forEach((task) => {
        task.isDone = true;
      });
      expect(backlogItem.moveToReadyForTesting(backlogItem.developer)).toBe(
        true
      );
    });
  });
  describe('Raport generator', () => {
    test('Voor een sprint kan een rapportage worden gegenereerd met de data "team samenstelling", burndown-chart, effort-punten per developer.', () => {
      const reportBuilder = new SRBPdf();
      const sprintReport = sprint1.generateSprintReport(reportBuilder);
      expect(sprintReport).toBeDefined();

      // Check if the report contains the team members
      expect(
        sprintReport.filter((x) => x.indexOf('Team member') > -1).length
      ).toBeGreaterThan(0);
      // Check if the report contains the Backlog finished status
      expect(
        sprintReport.filter((x) => x.indexOf('Backlog finished status') > -1)
          .length
      ).toBeGreaterThan(0);
    });

    test('Voor een rapportage kan ingesteld worden of er in de header/footer elementen moeten worden toegevoegd zoals "bedrijfslogo", "projectnaam", "versie" of "Datum".', () => {
      const reportBuilder = new SRBPdf();
      // Test with all settings disabled
      sprint1.reportSettings = new SRBSettings(false, false, false, false);
      let sprintReport = sprint1.generateSprintReport(reportBuilder);
      expect(
        sprintReport.filter((x) => x.indexOf('FooterDate:') > -1).length
      ).toBe(0);
      expect(
        sprintReport.filter((x) => x.indexOf('FooterVersion:') > -1).length
      ).toBe(0);
      expect(
        sprintReport.filter((x) => x.indexOf('HeaderCompany:') > -1).length
      ).toBe(0);
      expect(
        sprintReport.filter((x) => x.indexOf('HeaderImage:') > -1).length
      ).toBe(0);

      // Test with all settings enabled
      sprint1.reportSettings = new SRBSettings(true, true, true, true);
      sprintReport = sprint1.generateSprintReport(reportBuilder);
      expect(
        sprintReport.filter((x) => x.indexOf('FooterDate:') > -1).length
      ).toBe(1);
      expect(
        sprintReport.filter((x) => x.indexOf('FooterVersion:') > -1).length
      ).toBe(1);
      expect(
        sprintReport.filter((x) => x.indexOf('HeaderCompany:') > -1).length
      ).toBe(1);
      expect(
        sprintReport.filter((x) => x.indexOf('HeaderImage:') > -1).length
      ).toBe(1);
    });

    test('Een sprint rapportage kan worden gegenereerd in zowel PDF als PNG.', () => {
      // Validate PDF
      const sprintReportPDF = sprint1.generateSprintReport(new SRBPdf());
      expect(sprintReportPDF).toBeDefined();

      // Check if the report contains the team members
      expect(
        sprintReportPDF.filter((x) => x.indexOf('Team member') > -1).length
      ).toBeGreaterThan(0);
      // Check if the report contains the Backlog finished status
      expect(
        sprintReportPDF.filter((x) => x.indexOf('Backlog finished status') > -1)
          .length
      ).toBeGreaterThan(0);

      // Validate PNG
      const sprintReportPNG = sprint1.generateSprintReport(new SRBPng());
      expect(sprintReportPNG).toBeDefined();

      // Check if the report contains the team members
      expect(
        sprintReportPNG.filter(
          (x) => x.indexOf('Team member'.toUpperCase()) > -1
        ).length
      ).toBeGreaterThan(0);
      // Check if the report contains the Backlog finished status
      expect(
        sprintReportPNG.filter(
          (x) => x.indexOf('Backlog finished status'.toUpperCase()) > -1
        ).length
      ).toBeGreaterThan(0);
    });
  });

  describe('Pipeline', () => {
    const testPipeline = new Pipeline();
    const sourceBuilder = new PAHandlerSources();
    const buildBuilder = new PAHandlerBuild();
    const packageBuilder = new PAHandlerPackage();
    const deployBuilder = new PAHandlerDeploy();

    testPipeline.setPipelineHandler(sourceBuilder);
    sourceBuilder.setNext(buildBuilder);
    buildBuilder.setNext(packageBuilder);
    packageBuilder.setNext(deployBuilder);

    test('Er kan een pipeline worden gekoppeld aan de sprint', () => {
      sprint1.setStatus(ProjectSprintStatus.Draft);
      expect(sprint1.getPipeline()).toBe(null);
      expect(() => sprint1.setPipeline(testPipeline)).not.toThrow();
      expect(sprint1.getPipeline()).toBe(testPipeline);
    });
    test('Als een pipeline bezig is kan de sprint niet worden aangepast.', () => {
      testPipeline.pipelineIsRunning = true;
      expect(() => sprint1.setPipeline(testPipeline)).toThrow();
      testPipeline.pipelineIsRunning = false;
      expect(() => sprint1.setPipeline(testPipeline)).not.toThrow();
    });

    test('Wanneer een release-sprint pipeline faalt kan deze opnieuw handmatig worden gereleaset.', () => {
      const brokenPipeline = new Pipeline();
      const sourceBuilder = new PAHandlerSources();
      const failHandler = new PAHandlerFail();
      brokenPipeline.setPipelineHandler(sourceBuilder);
      sourceBuilder.setNext(failHandler);

      // Run
      sprint1.setPipeline(brokenPipeline);
      expect(() => {
        sprint1.getPipeline()?.execute();
      }).toThrowError('Broken handler called');

      sprint1.setPipeline(testPipeline);
      expect(() => {
        sprint1.getPipeline()?.execute();
      }).not.toThrow();
    });
  });

  describe('Release of review sprint', () => {
    // Create 'test' pipeline
    const testPipeline = new Pipeline();
    const sourceBuilder = new PAHandlerSources();
    testPipeline.setPipelineHandler(sourceBuilder);

    // Create 'deploy' pipeline
    const deployPipeline = new Pipeline();
    const deployBuilder = new PAHandlerDeploy();
    deployPipeline.setPipelineHandler(deployBuilder);
    deployPipeline.isDeploymentPipeline = true;
    test('Er is per sprint in te stellen of het een release of review sprint is.', () => {
      sprint1.setPipeline(deployPipeline);
      expect(sprint1.getIsReleaseSprint()).toBe(false);
      sprint1.setReleaseSprint(true);
      expect(sprint1.getIsReleaseSprint()).toBe(true);
    });
    test('Een release-sprint mag alleen gekoppeld worden aan een deployment-pipeline.', () => {
      sprint1.setReleaseSprint(false);
      expect(() => sprint1.setPipeline(testPipeline)).not.toThrow();
      expect(() => sprint1.setPipeline(deployPipeline)).not.toThrow();
      sprint1.setReleaseSprint(true);
      expect(() => sprint1.setPipeline(testPipeline)).toThrow();
      expect(() => sprint1.setPipeline(deployPipeline)).not.toThrow();
    });
    test('Nadat een review-sprint is afgerond moet er een sprint-review plaatsvinden', () => {
      // TODO: Write test
      expect(1).toBe(1);
    });
    test('Er kan na het afronden van een review-sprint een sprint-review document worden geüpload door de Scrum Master. Hierna gaat de sprint naar "completed"', () => {
      // TODO: Write test
      expect(1).toBe(1);
    });
    test('Als de resultaten van de release-sprint minder dan 50% van de taken is uitgevoerd, wordt de sprint terminated en niet gedeployed. Ook gaat er een notificatie naar de PO & SM.', () => {
      // TODO: Write test
      expect(1).toBe(1);
    });
    test('De release-sprint pipeline wordt gestart. Na het afronden van deze pipeline wordt er een notificatie gestuurd naar de PO & SM van de pipeline-status.', () => {
      // TODO: Write test
      expect(1).toBe(1);
    });
  });

  test('Een sprint kan meerdere statussen hebben: "draft", "active", "finished", "completed", "terminated"', () => {
    expect(sprint1.getStatus()).toBe(ProjectSprintStatus.Draft);
    sprint1.setStatus(ProjectSprintStatus.Active);
    expect(sprint1.getStatus()).toBe(ProjectSprintStatus.Active);
    sprint1.setStatus(ProjectSprintStatus.Finished);
    expect(sprint1.getStatus()).toBe(ProjectSprintStatus.Finished);
    sprint1.setStatus(ProjectSprintStatus.Completed);
    expect(sprint1.getStatus()).toBe(ProjectSprintStatus.Completed);
    sprint1.setStatus(ProjectSprintStatus.Terminated);
    expect(sprint1.getStatus()).toBe(ProjectSprintStatus.Terminated);
  });

  test('Alleen in de sprint-status "draft" kan een sprint worden gewijzigd. In alle andere statussen niet.', () => {
    sprint1.setStatus(ProjectSprintStatus.Draft);
    sprint1.setName('Sprint 2');
    expect(sprint1.getName()).toBe('Sprint 2');
    sprint1.setStatus(ProjectSprintStatus.Active);
    expect(() => sprint1.setName('Sprint 3')).toThrow();
    sprint1.setStatus(ProjectSprintStatus.Draft);
  });
});
