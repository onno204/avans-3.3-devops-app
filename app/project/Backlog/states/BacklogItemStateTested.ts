/* eslint-disable @typescript-eslint/no-unused-vars */
import { BacklogItem } from '../BacklogItem';
import { User } from '../../../models/User';
import { BacklogItemState } from './BacklogItemState';

export class BacklogItemStateTested extends BacklogItemState {
  constructor(protected readonly backlogItem: BacklogItem) {
    super(backlogItem);
  }

  private confirmUserIsProductOwner(user: User): boolean {
    return this.backlogItem.project.productOwner.id === user.id;
  }

  moveToTodo(user: User): boolean {
    // Cannot be moved to this state
    return false;
  }
  moveToDoing(user: User): boolean {
    // Cannot be moved to this state
    return false;
  }
  moveToReadyForTesting(user: User): boolean {
    // Only product owner can move to this state
    if (!this.confirmUserIsProductOwner(user)) {
      return false;
    }
    return super.moveToReadyForTesting(user);
  }
  moveToTesting(user: User): boolean {
    // Cannot be moved to this state
    return false;
  }
  moveToTested(user: User): boolean {
    // Already in this state
    return false;
  }
  moveToDone(user: User): boolean {
    // Only product owner can move to this state
    if (!this.confirmUserIsProductOwner(user)) {
      return false;
    }
    return super.moveToDone(user);
  }
}
