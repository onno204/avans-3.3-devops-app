import { User } from '../../models/User';

export interface ISendNotification {
  sendNotification(user: User, message: string): void;
}
