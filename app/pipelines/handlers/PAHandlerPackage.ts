import { PAHandlerBase } from './PAHandlerBase';

export class PAHandlerPackage extends PAHandlerBase {
  handle(): string[] {
    const myAwesomeLog = ['Package handler called'];
    return [...myAwesomeLog, ...super.handle()];
  }
}
