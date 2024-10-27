import { ForumThread } from '../forum/ForumThread';
import { ForumThreadPost } from '../forum/ForumThreadPost';
import { User } from '../models/User';
import { NotificationWorker } from '../notifications/NotificationWorker';
import { iSendNotification } from '../notifications/senders/iSendNotification';
import { BacklogItem } from '../project/Backlog/BacklogItem';
import { Project } from '../project/Project';
import { ProjectSprint } from '../project/sprint/ProjectSprint';
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

const getTestBacklogItems = (project: Project) => {
  return [
    new BacklogItem(project, 'Backlog item 1', testUsers.developers[0]),
    new BacklogItem(project, 'Backlog item 2', testUsers.developers[0]),
    new BacklogItem(project, 'Backlog item 3', testUsers.developers[0]),
    new BacklogItem(project, 'Backlog item 4', testUsers.developers[0]),
    new BacklogItem(project, 'Backlog item 5', testUsers.developers[0]),
  ];
};

const sendNotificationFunction = jest.fn();

// Generate a mock notification worker
const getNotificationMocker = (): iSendNotification => {
  return {
    sendNotification: sendNotificationFunction,
  };
};

describe('Forum', () => {
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
    testProject,
    'Sprint 1',
    testUsers.scrumMaster,
    new Date(),
    endDate,
    new SRBSettings(true, true, true, true)
  );
  testUsers.developers.forEach((developer) => {
    sprint1.addDeveloper(developer);
  });
  testUsers.testers.forEach((tester) => {
    sprint1.addTester(tester);
  });
  testProject.sprints.push(sprint1);
  testProject.currentActiveSprint = sprint1;

  // Overwrite the notification worker with a mock
  NotificationWorker.addHandlerOverride('slack', getNotificationMocker());
  NotificationWorker.addHandlerOverride('mail', getNotificationMocker());

  test('Je kan een forum aanmaken voor een project.', () => {
    expect(testProject.forum).toBeDefined();
  });
  test('Je kan een nieuwe thread aanmaken in een forum, deze is gekoppeld aan een backlog-item', () => {
    // Create new thread
    const thread = new ForumThread('Test thread', testProject.backlog[0]);
    // Add thread to forum
    testProject.forum.addThread(thread);
    // Check if thread is added
    expect(testProject.forum.getThreads()).toContain(thread);
    expect(thread.backlogItem).toBe(testProject.backlog[0]);
  });
  test('Je kan een comment plaatsen onder een forum-thread.', () => {
    // Create new thread
    const thread = new ForumThread('Test thread', testProject.backlog[0]);
    // Add thread to forum
    testProject.forum.addThread(thread);
    // Create new post
    const post = new ForumThreadPost(
      'Test post',
      testUsers.developers[0],
      'Test message'
    );
    // Add post to thread
    thread.addPost(post);
    // Check if post is added
    expect(thread.getPosts()).toContain(post);
  });
  test('Er wordt een notificatie verstuurd naar alle project-teamleden wanneer er een nieuwe comment wordt geplaatst onder een thread.', () => {
    sendNotificationFunction.mockClear();
    // Create new thread
    const thread = new ForumThread('Test thread', testProject.backlog[0]);
    // Add thread to forum
    testProject.forum.addThread(thread);
    // Create new post
    const post = new ForumThreadPost(
      'Test post',
      testUsers.developers[0],
      'Test message'
    );
    // Add post to thread
    thread.addPost(post);
    // Check if notification is sent
    expect(sendNotificationFunction).toHaveBeenCalledTimes(
      testUsers.developers.length * 2
    );
  });
  test('Er kan alleen een comment worden geplaatst onder een thread wanneer het bijbehorende backlog item nog niet is afgerond.', () => {
    // Create new thread
    const thread = new ForumThread('Test thread', testProject.backlog[0]);
    // Add thread to forum
    testProject.forum.addThread(thread);
    // Create new post
    const post = new ForumThreadPost(
      'Test post',
      testUsers.developers[0],
      'Test message'
    );
    // Finish backlog item
    testProject.backlog[0].moveToDoing(testProject.backlog[0].developer);
    testProject.backlog[0].moveToReadyForTesting(
      testProject.backlog[0].developer
    );
    testProject.backlog[0].moveToTesting(testUsers.testers[0]);
    testProject.backlog[0].moveToTested(testUsers.testers[0]);
    testProject.backlog[0].moveToDone(testUsers.productOwner);

    // Add post to thread
    expect(() => {
      thread.addPost(post);
    }).toThrowError('Cannot add post to done backlog item');
  });
});
