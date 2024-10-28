import { v4 as uuidv4 } from 'uuid';
import { BacklogItem } from '../Backlog/BacklogItem';
import { User } from '../../models/User';
import { SRBSettings } from './reportGenerator/SRBSettings';
import { ProjectSprintStatus } from './ProjectSprintStatus';
import { ISprintReportBuilder } from './reportGenerator/builder/iSprintReportBuilder';
import { SRBDirector } from './reportGenerator/SRBDirector';
import { Pipeline } from '../../pipelines/Pipeline';
import { NotificationPublisher } from '../../notifications/observer/NotificationPublisher';
import { Project } from '../Project';

export class ProjectSprint {
  id: string;
  private developers: User[] = [];
  private testers: User[] = [];
  private backLogItems: BacklogItem[] = [];
  private status: ProjectSprintStatus = ProjectSprintStatus.Draft;
  private isReleaseSprint: boolean = false;
  private pipeline: Pipeline | null = null;
  private uploadedSprintReport: string | null = null;

  constructor(
    private readonly project: Project,
    private name: string,
    public readonly scrumMaster: User,
    private startDate: Date,
    private endDate: Date,
    public reportSettings: SRBSettings
  ) {
    this.id = uuidv4();
  }

  setStatus(status: ProjectSprintStatus): void {
    switch (status) {
      case ProjectSprintStatus.Completed:
        // Require a sprint report to be uploaded before completing the sprint
        if (!this.uploadedSprintReport) {
          throw new Error(
            'Sprint report must be uploaded before completing the sprint'
          );
        }
        break;
      case ProjectSprintStatus.Finished:
        // If a sprint is finished start the pipeline
        if (this.pipeline) {
          if (this.isReleaseSprint) {
            // don't start the pipeline of less than 50 percent of the backlogitems are completed
            const completedItems = this.backLogItems.filter((item) =>
              item.isFinished()
            );
            if (completedItems.length / this.backLogItems.length < 0.5) {
              this.setStatus(ProjectSprintStatus.Terminated);
              [this.scrumMaster, this.project.productOwner].forEach((user) => {
                NotificationPublisher.publish(
                  user,
                  `Pipeline for sprint ${this.name} has not been started because less than 50% of the backlog items are completed`
                );
              });
              return;
            }
          }
          this.pipeline.execute();
          [this.scrumMaster, this.project.productOwner].forEach((user) => {
            NotificationPublisher.publish(
              user,
              `Pipeline for sprint ${this.name} has started`
            );
          });
        }
        break;
    }

    this.status = status;
  }

  generateSprintReport(builder: ISprintReportBuilder): string[] {
    const sRBDirector = new SRBDirector(builder, this.reportSettings);
    return sRBDirector.getReport(this);
  }

  //////////////////////////////////////////////////////
  // Basic Getters and Setters with sprint status validation
  //////////////////////////////////////////////////////

  // Sprint can be edited when it is in draft status and the pipeline is not running
  canBeEdited(): boolean {
    let canBeEdited = this.status === ProjectSprintStatus.Draft;
    if (this.pipeline) {
      canBeEdited = canBeEdited && !this.pipeline.pipelineIsRunning;
    }
    return canBeEdited;
  }

  setPipeline(pipeline: Pipeline): void {
    if (!this.canBeEdited()) {
      throw new Error('Sprint can not be edited');
    }
    if (this.isReleaseSprint && !pipeline.isDeploymentPipeline) {
      throw new Error('Release sprint can only have deployment pipeline');
    }
    this.pipeline = pipeline;
  }

  getPipeline(): Pipeline | null {
    return this.pipeline;
  }

  setReleaseSprint(isReleaseSprint: boolean): void {
    if (!this.canBeEdited()) {
      throw new Error('Sprint can not be edited');
    }
    if (
      isReleaseSprint &&
      this.pipeline &&
      !this.pipeline.isDeploymentPipeline
    ) {
      throw new Error('Release sprint can only have deployment pipeline');
    }
    this.isReleaseSprint = isReleaseSprint;
  }

  getIsReleaseSprint(): boolean {
    return this.isReleaseSprint;
  }

  setName(name: string): void {
    if (!this.canBeEdited()) {
      throw new Error('Sprint can not be edited');
    }
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  setStartDate(date: Date): void {
    if (!this.canBeEdited()) {
      throw new Error('Sprint can not be edited');
    }
    this.startDate = date;
  }

  getStartDate(): Date {
    return this.startDate;
  }

  setEndDate(date: Date): void {
    if (!this.canBeEdited()) {
      throw new Error('Sprint can not be edited');
    }
    this.endDate = date;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  addDeveloper(user: User): void {
    if (!this.canBeEdited()) {
      throw new Error('Sprint can not be edited');
    }
    this.developers.push(user);
  }

  removeDeveloper(user: User): void {
    if (!this.canBeEdited()) {
      throw new Error('Sprint can not be edited');
    }
    this.developers = this.developers.filter((dev) => dev.id !== user.id);
  }

  getDevelopers(): User[] {
    return this.developers;
  }

  addTester(user: User): void {
    if (!this.canBeEdited()) {
      throw new Error('Sprint can not be edited');
    }
    this.testers.push(user);
  }

  removeTester(user: User): void {
    if (!this.canBeEdited()) {
      throw new Error('Sprint can not be edited');
    }
    this.testers = this.testers.filter((tester) => tester.id !== user.id);
  }

  getTesters(): User[] {
    return this.testers;
  }

  addBacklogItem(item: BacklogItem): void {
    if (!this.canBeEdited()) {
      throw new Error('Sprint can not be edited');
    }
    this.backLogItems.push(item);
  }

  removeBacklogItem(item: BacklogItem): void {
    if (!this.canBeEdited()) {
      throw new Error('Sprint can not be edited');
    }
    this.backLogItems = this.backLogItems.filter((i) => i.id !== item.id);
  }

  getBacklogItems(): BacklogItem[] {
    return this.backLogItems;
  }

  getStatus(): ProjectSprintStatus {
    return this.status;
  }

  getUploadedSprintReport(): string | null {
    return this.uploadedSprintReport;
  }

  uploadSprintReport(report: string | null): void {
    if (this.status !== ProjectSprintStatus.Finished) {
      throw new Error('Sprint must be finished to upload a report');
    }
    this.uploadedSprintReport = report;
  }
}
