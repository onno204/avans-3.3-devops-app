import { iPipelineActionHandler } from './iPipelineActionHandler';

export abstract class PAHandlerBase implements iPipelineActionHandler {
  private next: iPipelineActionHandler | null = null;

  setNext(next: iPipelineActionHandler): void {
    this.next = next;
  }

  handle(): string[] {
    if (this.next) {
      return this.next.handle();
    }
    return [];
  }
}
