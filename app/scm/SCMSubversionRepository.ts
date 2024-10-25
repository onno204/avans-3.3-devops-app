import { v4 as uuidv4 } from 'uuid';

export class SCMSubversionRepository {
  id: string;
  trees: string[];

  constructor(private readonly name: string) {
    this.id = uuidv4();
    this.trees = [];
  }

  getName() {
    return this.name;
  }

  addTree(treeName: string) {
    this.trees.push(treeName);
  }

  getTrees() {
    return this.trees;
  }
}
