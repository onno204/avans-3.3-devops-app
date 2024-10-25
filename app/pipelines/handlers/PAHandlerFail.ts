import { PAHandlerBase } from './PAHandlerBase';

export class PAHandlerFail extends PAHandlerBase {
  handle(): string[] {
    throw new Error('Broken handler called');
  }
}
