/* eslint-disable @typescript-eslint/no-unused-vars */
import { BacklogItem } from '../BacklogItem';
import { User } from '../../../models/User';
import { NotificationPublisher } from '../../../notifications/observer/NotificationPublisher';
import { BacklogItemState } from './BacklogItemState';

export class BacklogItemStateReadyForTesting extends BacklogItemState {
  constructor(protected readonly backlogItem: BacklogItem) {
    super(backlogItem);
  }

  onEnterState(user: User): void {
    // Check if there is an active sprint to a notficiation can be sent
    if (!this.backlogItem.project.currentActiveSprint) {
      throw new Error(
        'No active sprint but backlogitem changed to ready for testing'
      );
    }

    // send notification to all testers of the sprint
    this.backlogItem.project.currentActiveSprint
      .getTesters()
      .forEach((tester) => {
        NotificationPublisher.publish(
          tester,
          `BacklogItem ${this.backlogItem.name} is ready for testing`
        );
      });
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
    // Cannot be moved to this state
    return false;
  }
  moveToDoing(user: User): boolean {
    // Cannot be moved to this state
    return false;
  }
  moveToReadyForTesting(user: User): boolean {
    // Already in this state
    return false;
  }
  moveToTesting(user: User): boolean {
    // Only testers can move to this state
    if (!this.confirmUserIsTester(user)) {
      return false;
    }
    return super.moveToTesting(user);
  }
  moveToTested(user: User): boolean {
    return false;
  }
  moveToDone(user: User): boolean {
    // Cannot skip previous state
    return false;
  }
}
