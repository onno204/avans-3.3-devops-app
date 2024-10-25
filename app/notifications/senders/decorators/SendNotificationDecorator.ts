import { User } from '../../../models/User';
import { iSendNotification } from '../iSendNotification';

export class SendNotificationDecorator implements iSendNotification {
  private wrapped: iSendNotification;

  constructor(wrapped: iSendNotification) {
    this.wrapped = wrapped;
  }

  sendNotification(user: User, message: string): void {
    // Execute the wrapped notification
    this.wrapped.sendNotification(user, message);
  }
}
