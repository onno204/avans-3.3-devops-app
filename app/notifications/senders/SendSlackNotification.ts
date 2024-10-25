import { User } from '../../models/User';
import { iSendNotification } from './iSendNotification';

export class SendSlackNotification implements iSendNotification {
  sendNotification(user: User, message: string): void {
    // Only send Slack notification if user has opted in
    if (!user.doNotifySlack) {
      return;
    }

    // Send Slack notification
    console.log(`Sending Slack notification to ${user.name}: ${message}`);
  }
}
