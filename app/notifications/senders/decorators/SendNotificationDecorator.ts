import { User } from '../../../models/User';
import { ISendNotification } from '../iSendNotification';

export class SendNotificationDecorator implements ISendNotification {
  private wrapped: ISendNotification;

  constructor(wrapped: ISendNotification) {
    this.wrapped = wrapped;
  }

  sendNotification(user: User, message: string): void {
    // Execute the wrapped notification
    this.wrapped.sendNotification(user, message);
  }
}
