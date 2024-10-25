/* eslint-disable @typescript-eslint/no-unused-vars */
import { BacklogItem } from '../BacklogItem';
import { User } from '../../../models/User';
import { BacklogItemState } from './BacklogItemState';

export class BacklogItemStateDone extends BacklogItemState {
  constructor(protected readonly backlogItem: BacklogItem) {
    super(backlogItem);
  }

  moveToTodo(user: User): boolean {
    return false;
  }
  moveToDoing(user: User): boolean {
    return false;
  }
  moveToReadyForTesting(user: User): boolean {
    return false;
  }
  moveToTesting(user: User): boolean {
    // Cannot skip previous state
    return false;
  }
  moveToTested(user: User): boolean {
    return false;
  }
  moveToDone(user: User): boolean {
    // Already in this state
    return false;
  }
}
