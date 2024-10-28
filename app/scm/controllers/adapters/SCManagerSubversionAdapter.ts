import { SCMGitRepository } from '../../SCMGitRepository';
import { SCMSubversionRepository } from '../../SCMSubversionRepository';
import { ISCManager } from '../iSCManager';
import { SCManagerSubversionController } from '../SCManagerSubversionController';

// Pattern: Adapter
export class SCManagerSubversionAdapter implements ISCManager {
  constructor(private readonly scmSubversion: SCManagerSubversionController) {}

  createRepository(name: string): boolean {
    return this.scmSubversion.createProject(name);
  }

  getRepositoryByName(name: string): SCMGitRepository | null {
    const subvRepo = this.scmSubversion.getByVariable('name', name);
    if (!subvRepo) {
      return null;
    }
    return this.subversionToGitRepository(subvRepo);
  }

  createNewBranch(repositoryName: string, branchName: string): boolean {
    return this.scmSubversion.createNewTree(repositoryName, branchName);
  }

  private subversionToGitRepository(
    subversionRepository: SCMSubversionRepository
  ): SCMGitRepository {
    const gitRepository = new SCMGitRepository(subversionRepository.getName());
    subversionRepository.getTrees().forEach((tree) => {
      gitRepository.addBranch(tree);
    });
    return gitRepository;
  }
}
