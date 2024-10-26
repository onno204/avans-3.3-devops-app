/* eslint-disable @typescript-eslint/no-unused-vars */
import { BacklogItem } from '../BacklogItem';
import { User } from '../../../models/User';
import { BacklogItemState } from './BacklogItemState';
import { BacklogItemStateDoing } from './BacklogItemStateDoing';

export class BacklogItemStateTodo extends BacklogItemState {
  constructor(protected readonly backlogItem: BacklogItem) {
    super(backlogItem);
  }

  moveToTodo(user: User): boolean {
    // Already in this state
    return false;
  }
  moveToDoing(user: User): boolean {
    // Check if the user is the one who created the item
    if (this.backlogItem.developer.id !== user.id) {
      return false;
    }

    // Check if user is not doing any other item
    if (
      this.backlogItem.project.backlog.some(
        (item) =>
          item.developer.id === user.id &&
          item.currentState instanceof BacklogItemStateDoing
      )
    ) {
      return false;
    }

    // Move to doing
    return super.moveToDoing(user);
  }
  moveToReadyForTesting(user: User): boolean {
    // Cannot skip previous state
    return false;
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
