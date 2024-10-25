import { User } from '../../models/User';
import { iSendNotification } from './iSendNotification';

export class SendMailNotifiaction implements iSendNotification {
  sendNotification(user: User, message: string): void {
    // Only send email if user has opted in
    if (!user.doNotifyEmail) {
      return;
    }

    // Send email
    console.log(`Sending mail notification to ${user.name}: ${message}`);
  }
}
