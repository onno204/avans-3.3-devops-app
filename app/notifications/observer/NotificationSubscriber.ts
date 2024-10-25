import { User } from '../../models/User';

export class NotificationSubscriber {
  private handler: (user: User, message: string) => void;

  constructor(handler: (user: User, message: string) => void) {
    this.handler = handler;
  }

  notify(user: User, message: string): void {
    this.handler(user, message);
  }
}
