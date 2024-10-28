import { ProjectSprint } from '../ProjectSprint';
import { ISprintReportBuilder } from './builder/iSprintReportBuilder';
import { SRBSettings } from './SRBSettings';

export class SRBDirector {
  constructor(
    private readonly builder: ISprintReportBuilder,
    private readonly settings: SRBSettings
  ) {}

  getReport(sprint: ProjectSprint): string[] {
    this.builder.reset();
    if (this.settings.headerCompanyNameEnabled) {
      this.builder.addHeaderCompany('Awesome Company Name');
    }
    if (this.settings.headerImageEnabled) {
      this.builder.addHeaderImage('VeryCoolImage.jpg');
    }
    if (this.settings.footerVersionEnabled) {
      this.builder.addFooterVersion('Version 0.0.0.1');
    }
    if (this.settings.footerDateEnabled) {
      this.builder.addFooterDate('Today');
    }
    this.builder.addSprintData(sprint);
    return this.builder.getReport();
  }
}
