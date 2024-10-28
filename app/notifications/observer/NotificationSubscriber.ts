import { User } from '../../models/User';

export class NotificationSubscriber {
  constructor(
    private readonly handler: (user: User, message: string) => void
  ) {}

  notify(user: User, message: string): void {
    this.handler(user, message);
  }
}
