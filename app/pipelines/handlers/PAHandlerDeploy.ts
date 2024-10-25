import { PAHandlerBase } from './PAHandlerBase';

export class PAHandlerDeploy extends PAHandlerBase {
  handle(): string[] {
    const myAwesomeLog = ['Deploy handler called'];
    return [...myAwesomeLog, ...super.handle()];
  }
}
