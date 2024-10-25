/* eslint-disable @typescript-eslint/no-unused-vars */
import { BacklogItem } from '../BacklogItem';
import { User } from '../../../models/User';
import { BacklogItemState } from './BacklogItemState';

export class BacklogItemStateDoing extends BacklogItemState {
  constructor(protected readonly backlogItem: BacklogItem) {
    super(backlogItem);
  }

  moveToTodo(user: User): boolean {
    // Cannot move to previous state
    return false;
  }
  moveToDoing(user: User): boolean {
    // Already in this state
    return false;
  }
  moveToReadyForTesting(user: User): boolean {
    // Confirm all tasks for this item are done
    if (!this.backlogItem.areAllTasksFinished()) {
      console.log('NOT ALL TASKS ARE FINISHED');
      return false;
    }
    console.log('ALL TASKS ARE FINISHED');
    return super.moveToReadyForTesting(user);
  }
  moveToTesting(user: User): boolean {
    // Cannot skip previous state
    return false;
  }
  moveToTested(user: User): boolean {
    // Cannot skip previous state
    return false;
  }
  moveToDone(user: User): boolean {
    // Cannot skip previous state
    return false;
  }
}
