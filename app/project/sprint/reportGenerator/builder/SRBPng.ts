import { ProjectSprint } from '../../ProjectSprint';
import { iSprintReportBuilder } from './iSprintReportBuilder';

export class SRBPng implements iSprintReportBuilder {
  private header: string[] = [];
  private body: string[] = [];
  private footer: string[] = [];

  reset(): void {
    this.footer = [];
    this.body = [];
    this.header = [];
  }

  addFooterDate(date: string): void {
    this.footer.push(`Etad: ${date}`);
  }

  addFooterVersion(version: string): void {
    this.footer.push(`Noisrev: ${version}`);
  }

  addHeaderCompany(company: string): void {
    this.header.push(`Ynapmoc: ${company}`);
  }

  addHeaderImage(image: string): void {
    this.header.push(`Egami: ${image}`);
  }

  addSprintData(sprint: ProjectSprint): void {
    this.body.push(`Sprint: ${sprint.getName()}`.toUpperCase());
    this.body.push(
      `Start Date: ${sprint.getStartDate().toDateString()}`.toUpperCase()
    );
    this.body.push(
      `Team members: ${sprint.scrumMaster.name}, ${sprint
        .getDevelopers()
        .map((d) => d.name)
        .join(', ')}, ${sprint
        .getTesters()
        .map((t) => t.name)
        .join(', ')}`.toUpperCase()
    );
    this.body.push(
      `Backlog finished status: ${
        sprint.getBacklogItems().filter((b) => b.isFinished()).length
      }/${sprint.getBacklogItems().length}`.toUpperCase()
    );

    // Add per developer status of the backlog items
    sprint.getDevelopers().forEach((dev) => {
      const finishedCount = sprint
        .getBacklogItems()
        .filter((b) => b.isFinished() && b.developer.id === dev.id).length;
      const unfinishedCount = sprint
        .getBacklogItems()
        .filter((b) => !b.isFinished() && b.developer.id === dev.id).length;
      // Show developer name with amount of finished and unfinished backlog items
      this.body.push(
        `Developer: ${dev.name}. Finished: ${finishedCount}, Unfinished: ${unfinishedCount}`.toUpperCase()
      );
    });
  }

  getReport(): string[] {
    return [
      'PnG rEpOrT',
      'HeAdEr',
      ...this.header,
      'bOdY',
      ...this.body,
      'FoOtEr',
      ...this.footer,
    ];
  }
}
