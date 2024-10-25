import { PAHandlerBase } from './PAHandlerBase';

export class PAHandlerBuild extends PAHandlerBase {
  handle(): string[] {
    const myAwesomeLog = ['Build handler called'];
    return [...myAwesomeLog, ...super.handle()];
  }
}
