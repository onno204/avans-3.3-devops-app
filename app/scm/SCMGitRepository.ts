import { v4 as uuidv4 } from 'uuid';

export class SCMGitRepository {
  id: string;
  branches: string[];

  constructor(private readonly name: string) {
    this.id = uuidv4();
    this.branches = [];
  }

  getName() {
    return this.name;
  }

  addBranch(branchName: string) {
    this.branches.push(branchName);
  }

  getBranches() {
    return this.branches;
  }
}
