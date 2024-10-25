import { v4 as uuidv4 } from 'uuid';
import { BacklogItem } from './Backlog/BacklogItem';
import { Forum } from '../models/Forum';
import { Pipeline } from '../pipelines/Pipeline';
import { ProjectSprint } from './sprint/ProjectSprint';
import { User } from '../models/User';

export class Project {
  id: string;
  currentActiveSprint: ProjectSprint | null = null;
  sprints: ProjectSprint[] = [];
  backlog: BacklogItem[] = [];
  forum: Forum = new Forum(this);
  piplines: Pipeline[] = [];

  constructor(
    public readonly name: string,
    public readonly productOwner: User
  ) {
    this.id = uuidv4();
    this.name = name;
  }
}