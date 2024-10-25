/* eslint-disable @typescript-eslint/no-unused-vars */
import { BacklogItem } from '../BacklogItem';
import { User } from '../../../models/User';
import { NotificationPublisher } from '../../../notifications/observer/NotificationPublisher';
import { BacklogItemState } from './BacklogItemState';

export class BacklogItemStateTesting extends BacklogItemState {
  constructor(protected readonly backlogItem: BacklogItem) {
    super(backlogItem);
  }

  private confirmUserIsTester(user: User): boolean {
    // Check if there is an active sprint
    if (!this.backlogItem.project.currentActiveSprint) {
      return false;
    }
    return this.backlogItem.project.currentActiveSprint
      .getTesters()
      .some((tester) => tester.id === user.id);
  }

  moveToTodo(user: User): boolean {
    // Only testers can move to this state
    if (!this.confirmUserIsTester(user)) {
      return false;
    }

    // Check if there is an active sprint
    if (!this.backlogItem.project.currentActiveSprint) {
      return false;
    }

    const moveSuccessfully = super.moveToTodo(user);

    // If moved back notify the Scrum master
    if (moveSuccessfully) {
      NotificationPublisher.publish(
        this.backlogItem.project.currentActiveSprint.scrumMaster,
        `BacklogItem ${this.backlogItem.name} moved from testing back to Todo`
      );
    }
    return moveSuccessfully;
  }
  moveToDoing(user: User): boolean {
    // Cannot be moved to this state
    return false;
  }
  moveToReadyForTesting(user: User): boolean {
    return false;
  }
  moveToTesting(user: User): boolean {
    // Already in this state
    return false;
  }
  moveToTested(user: User): boolean {
    // Only testers can move to this state
    if (!this.confirmUserIsTester(user)) {
      return false;
    }
    return super.moveToTested(user);
  }
  moveToDone(user: User): boolean {
    // Cannot skip previous state
    return false;
  }
}
