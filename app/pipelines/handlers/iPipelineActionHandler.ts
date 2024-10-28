// Pattern: Chain of Responsibility
export interface IPipelineActionHandler {
  handle(): string[];
}
