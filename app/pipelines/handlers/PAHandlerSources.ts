import { PAHandlerBase } from './PAHandlerBase';

export class PAHandlerSources extends PAHandlerBase {
  handle(): string[] {
    const myAwesomeLog = ['Sources handler called'];
    return [...myAwesomeLog, ...super.handle()];
  }
}
