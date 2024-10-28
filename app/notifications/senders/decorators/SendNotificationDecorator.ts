import { User } from '../../../models/User';
import { ISendNotification } from '../iSendNotification';

// Pattern: Decorator
export class SendNotificationDecorator implements ISendNotification {
  constructor(private readonly wrapped: ISendNotification) {}

  sendNotification(user: User, message: string): void {
    // Execute the wrapped notification
    this.wrapped.sendNotification(user, message);
  }
}
