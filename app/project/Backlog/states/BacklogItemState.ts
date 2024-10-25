/* eslint-disable @typescript-eslint/no-unused-vars */
import { BacklogItem } from '../BacklogItem';
import { User } from '../../../models/User';

export abstract class BacklogItemState {
  constructor(protected readonly backlogItem: BacklogItem) {}

  onEnterState(user: User): void {}

  canChangedToThisState(user: User): boolean {
    return true;
  }

  moveToTodo(user: User): boolean {
    return this.backlogItem.changeState(this.backlogItem.todoState, user);
  }

  moveToDoing(user: User): boolean {
    return this.backlogItem.changeState(this.backlogItem.doingState, user);
  }

  moveToReadyForTesting(user: User): boolean {
    return this.backlogItem.changeState(
      this.backlogItem.readyForTestingState,
      user
    );
  }

  moveToTesting(user: User): boolean {
    return this.backlogItem.changeState(this.backlogItem.testingState, user);
  }

  moveToTested(user: User): boolean {
    return this.backlogItem.changeState(this.backlogItem.testedState, user);
  }

  moveToDone(user: User): boolean {
    return this.backlogItem.changeState(this.backlogItem.doneState, user);
  }
}
