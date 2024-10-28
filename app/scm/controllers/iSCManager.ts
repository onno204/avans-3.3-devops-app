import { SCMGitRepository } from '../SCMGitRepository';

export interface ISCManager {
  createRepository(name: string): boolean;
  getRepositoryByName(name: string): SCMGitRepository | null;

  createNewBranch(repositoryName: string, branchName: string): boolean;
}
