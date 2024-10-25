import { RepositoryController } from '../controllers/RepositoryController';
import { Project } from './Project';

export class ProjectController {
  // use repository controller to get repository
  public static createProject(project: Project): Project {
    return RepositoryController.get<Project>(project).add(project);
  }

  // update project
  public static updateProject(project: Project): Project | null {
    return RepositoryController.get<Project>(project).update(project);
  }

  // get project by id
  public static getProjectById(id: string): Project | null {
    return RepositoryController.get<Project>(new Project('', '')).getById(id);
  }
}
