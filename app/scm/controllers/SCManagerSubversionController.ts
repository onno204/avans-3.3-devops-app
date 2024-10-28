import { IRepository } from '../../repositories/iRepository';
import { SCMSubversionRepository } from '../SCMSubversionRepository';

export class SCManagerSubversionController {
  constructor(
    private readonly subversionRepositories: IRepository<SCMSubversionRepository>
  ) {}

  createProject(name: string): boolean {
    this.subversionRepositories.add(new SCMSubversionRepository(name));
    return true;
  }

  getByVariable(
    variable: string,
    value: string
  ): SCMSubversionRepository | null {
    return this.subversionRepositories.getByVariable(variable, value);
  }

  createNewTree(repositoryName: string, treeName: string): boolean {
    const repository = this.subversionRepositories.getByVariable(
      'name',
      repositoryName
    );
    if (!repository) {
      return false;
    }
    repository.addTree(treeName);
    return true;
  }
}
