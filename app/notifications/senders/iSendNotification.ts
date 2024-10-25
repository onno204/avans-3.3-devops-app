import { User } from '../../models/User';

export interface iSendNotification {
  sendNotification(user: User, message: string): void;
}
