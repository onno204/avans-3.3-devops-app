import { Project } from '../project/Project';
import { ForumThread } from './ForumThread';

export class Forum {
  private threads: ForumThread[] = [];

  constructor(private readonly project: Project) {}

  addThread(thread: ForumThread): void {
    this.threads.push(thread);
  }

  getThreads(): ForumThread[] {
    return this.threads;
  }
}
