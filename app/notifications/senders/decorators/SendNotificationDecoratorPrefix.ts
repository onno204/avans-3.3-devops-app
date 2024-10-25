import { User } from '../../../models/User';
import { SendNotificationDecorator } from './SendNotificationDecorator';

export class SendNotificationDecoratorPrefix extends SendNotificationDecorator {
  sendNotification(user: User, message: string): void {
    // Prefix the message with the user's name
    const prefixedMessage = `Hi ${user.name}, you have a new message: ${message}`;

    // Execute the wrapped notification
    super.sendNotification(user, prefixedMessage);
  }
}
