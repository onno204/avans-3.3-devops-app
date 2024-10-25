import { v4 as uuidv4 } from 'uuid';
import { User } from '../../models/User';

export class BacklogItemTask {
  id: string;
  isDone: boolean = false;

  constructor(public name: string, public readonly developer: User) {
    this.id = uuidv4();
  }
}
