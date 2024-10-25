import { iRepository } from '../../repositories/iRepository';
import { SCMGitRepository } from '../SCMGitRepository';
import { iSCManager } from './iSCManager';

export class SCManagerGitController implements iSCManager {
  constructor(
    private readonly gitRepositories: iRepository<SCMGitRepository>
  ) {}

  createRepository(name: string): boolean {
    this.gitRepositories.add(new SCMGitRepository(name));
    return true;
  }

  getRepositoryByName(name: string): SCMGitRepository | null {
    return this.gitRepositories.getByVariable('name', name);
  }

  createNewBranch(repositoryName: string, branchName: string): boolean {
    const repository = this.gitRepositories.getByVariable(
      'name',
      repositoryName
    );
    if (!repository) {
      return false;
    }
    repository.addBranch(branchName);
    return true;
  }
}
