import { IPipelineActionHandler } from './IPipelineActionHandler';

export abstract class PAHandlerBase implements IPipelineActionHandler {
  private next: IPipelineActionHandler | null = null;

  setNext(next: IPipelineActionHandler): void {
    this.next = next;
  }

  handle(): string[] {
    if (this.next) {
      return this.next.handle();
    }
    return [];
  }
}
