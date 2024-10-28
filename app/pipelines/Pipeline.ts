import { IPipelineActionHandler } from './handlers/IPipelineActionHandler';

export class Pipeline {
  private handler: IPipelineActionHandler | null = null;
  public isDeploymentPipeline: boolean = false;
  public pipelineIsRunning: boolean = false;

  public setPipelineHandler(handler: IPipelineActionHandler): void {
    this.handler = handler;
  }

  public execute(): string[] {
    if (!this.handler) {
      throw new Error('No handler set for the pipeline');
    }
    // Set the pipelineIsRunning while the handlers are running
    this.pipelineIsRunning = true;
    try {
      const status = this.handler.handle();
      this.pipelineIsRunning = false;
      return status;
    } catch (error) {
      this.pipelineIsRunning = false;
      throw error;
    }
  }
}
