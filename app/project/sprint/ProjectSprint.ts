import { v4 as uuidv4 } from 'uuid';
import { BacklogItem } from '../Backlog/BacklogItem';
import { User } from '../../models/User';
import { SRBSettings } from './reportGenerator/SRBSettings';
import { ProjectSprintStatus } from './ProjectSprintStatus';
import { iSprintReportBuilder } from './reportGenerator/builder/iSprintReportBuilder';
import { SRBDirector } from './reportGenerator/SRBDirector';
import { Pipeline } from '../../pipelines/Pipeline';

export class ProjectSprint {
  id: string;
  private developers: User[] = [];
  private testers: User[] = [];
  private backLogItems: BacklogItem[] = [];
  private status: ProjectSprintStatus = ProjectSprintStatus.Draft;
  private isReleaseSprint: boolean = false;
  private pipeline: Pipeline | null = null;

  constructor(
    private name: string,
    public readonly scrumMaster: User,
    private startDate: Date,
    private endDate: Date,
    public reportSettings: SRBSettings
  ) {
    this.id = uuidv4();
  }

  setStatus(status: ProjectSprintStatus): void {
    // TODO
    this.status = status;
  }

  generateSprintReport(builder: iSprintReportBuilder): string[] {
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
}