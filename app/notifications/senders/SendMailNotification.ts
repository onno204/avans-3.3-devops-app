import { User } from '../../models/User';
import { ISendNotification } from './iSendNotification';

export class SendMailNotification implements ISendNotification {
  sendNotification(user: User, message: string): void {
    // Only send email if user has opted in
    if (!user.doNotifyEmail) {
      return;
    }

    // Send email
    console.log(`Sending mail notification to ${user.name}: ${message}`);
  }
}
