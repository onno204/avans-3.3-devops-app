import { User } from '../../models/User';
import { NotificationSubscriber } from './NotificationSubscriber';
import { NotificationWorker } from '../NotificationWorker';

export class NotificationPublisher {
  private static subscribers: NotificationSubscriber[] = [];

  static subscribe(subscriber: NotificationSubscriber) {
    this.subscribers.push(subscriber);
  }

  static unsubscribe(subscriber: NotificationSubscriber) {
    this.subscribers = this.subscribers.filter((s) => s !== subscriber);
  }

  static publish(user: User, message: string) {
    // Make sure the notification subscribers are running
    NotificationWorker.start();

    // Notify all subscribers
    this.subscribers.forEach((subscriber) => subscriber.notify(user, message));
  }
}
