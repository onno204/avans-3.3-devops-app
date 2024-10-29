import { User } from '../models/User';
import { SendNotificationDecoratorPrefix } from './senders/decorators/SendNotificationDecoratorPrefix';
import { NotificationPublisher } from './observer/NotificationPublisher';
import { NotificationSubscriber } from './observer/NotificationSubscriber';
import { ISendNotification } from './senders/iSendNotification';
import { SendSlackNotification } from './senders/SendSlackNotification';
import { SendMailNotification } from './senders/SendMailNotification';

// Used to start the notification subscribers
export class NotificationWorker {
  private static hasStarted = false;

  private static handlerOverrides: { [key: string]: ISendNotification } = {};

  /**
   * This method is used to override the default handler for a given key.
   * This is useful for testing purposes.
   */
  static addHandlerOverride(key: string, handler: ISendNotification) {
    this.handlerOverrides[key] = handler;
  }

  static removeHandlerOverride(key: string) {
    delete this.handlerOverrides[key];
  }

  /**
   * Main entry point for the notification worker.
   */
  static start() {
    // If the worker has already started, do nothing
    if (this.hasStarted) {
      return;
    }
    this.hasStarted = true;

    // Start the notification subscribers
    NotificationPublisher.subscribe(this.getSlackSubscriber());
    NotificationPublisher.subscribe(this.getMailSubsrciber());
  }

  /**
   * Remove old subscribers and reset the worker.
   */
  static reset() {
    NotificationPublisher.unsubscribe(this.getSlackSubscriber());
    NotificationPublisher.unsubscribe(this.getMailSubsrciber());
    this.hasStarted = false;
    this.start();
  }

  // Get the Slack subscriber
  private static getSlackSubscriber() {
    return this.getHandlerFunction(this.getHandler('slack'));
  }

  // Get the Mail subscriber
  private static getMailSubsrciber() {
    return this.getHandlerFunction(this.getHandler('mail'));
  }

  /**
   * This method is used to override the default handler for a given key.
   * This is useful for testing purposes.
   */
  private static getHandler(key: string) {
    if (this.handlerOverrides[key]) {
      return this.handlerOverrides[key];
    }
    switch (key) {
      case 'slack':
        return new SendSlackNotification();
      case 'mail':
        return new SendMailNotification();
      default:
        throw new Error(`Unknown handler: ${key}`);
    }
  }

  /**
   * This method returns a subscriber handler function that will have a decorator added to it.
   * Public method so it can be used in tests to verify if the notification is sent.
   */
  public static getHandlerFunction(sender: ISendNotification) {
    return new NotificationSubscriber((user: User, message: string) => {
      // Add a prefix to the message
      const prefixDecorator = new SendNotificationDecoratorPrefix(sender);

      // Send the notification
      prefixDecorator.sendNotification(user, message);
    });
  }
}
