import { ProjectSprint } from '../../ProjectSprint';
import { iSprintReportBuilder } from './iSprintReportBuilder';

export class SRBPdf implements iSprintReportBuilder {
  private header: string[] = [];
  private body: string[] = [];
  private footer: string[] = [];

  reset(): void {
    this.footer = [];
    this.body = [];
    this.header = [];
  }

  addFooterDate(date: string): void {
    this.footer.push(`FooterDate: ${date}`);
  }

  addFooterVersion(version: string): void {
    this.footer.push(`FooterVersion: ${version}`);
  }

  addHeaderCompany(company: string): void {
    this.header.push(`HeaderCompany: ${company}`);
  }

  addHeaderImage(image: string): void {
    this.header.push(`HeaderImage: ${image}`);
  }

  addSprintData(sprint: ProjectSprint): void {
    this.body.push(`Sprint: ${sprint.getName()}`);
    this.body.push(`Start Date: ${sprint.getStartDate().toDateString()}`);
    this.body.push(
      `Team members: ${sprint.scrumMaster.name}, ${sprint
        .getDevelopers()
        .map((d) => d.name)
        .join(', ')}, ${sprint
        .getTesters()
        .map((t) => t.name)
        .join(', ')}`
    );
    this.body.push(
      `Backlog finished status: ${
        sprint.getBacklogItems().filter((b) => b.isFinished()).length
      }/${sprint.getBacklogItems().length}`
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
        `Developer: ${dev.name}. Finished: ${finishedCount}, Unfinished: ${unfinishedCount}`
      );
    });
  }

  getReport(): string[] {
    return [
      'PDF REPORT',
      'HEADER',
      ...this.header,
      'BODY',
      ...this.body,
      'FOOTER',
      ...this.footer,
    ];
  }
}
