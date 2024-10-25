import { ProjectSprint } from '../../ProjectSprint';

export interface iSprintReportBuilder {
  reset(): void;
  addFooterDate(date: string): void;
  addFooterVersion(version: string): void;
  addHeaderCompany(company: string): void;
  addHeaderImage(image: string): void;
  addSprintData(sprint: ProjectSprint): void;
  getReport(): string[];
}