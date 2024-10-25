/* eslint-disable @typescript-eslint/no-explicit-any */
import { Repository } from '../repositories/Repository';
import { iRepository } from '../repositories/iRepository';

export class RepositoryController {
  // Singleton instance for getting repository instances
  private static instance: RepositoryController;
  // In memory repository for storing repositories
  private repositories: Array<iRepository<any>> = new Array<iRepository<any>>();

  // Return singleton instance
  public static getController(): RepositoryController {
    if (!RepositoryController.instance) {
      RepositoryController.instance = new RepositoryController();
    }
    return RepositoryController.instance;
  }

  public static get<Type>(type: Type): iRepository<Type> {
    return RepositoryController.getController().getRepository<Type>(type);
  }

  // Get repository by name
  public getRepository<Type>(type: Type): iRepository<Type> {
    let result: null | iRepository<Type> = null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.repositories.forEach((element, index) => {
      if (typeof element.getType() === typeof type) {
        result = element;
      }
    });
    if (result === null) {
      result = new Repository<Type>(type);
      this.repositories.push(result);
    }
    return result;
  }
}
