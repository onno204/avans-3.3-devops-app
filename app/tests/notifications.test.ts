import { User } from '../models/User';
import { NotificationWorker } from '../notifications/NotificationWorker';
import { NotificationPublisher } from '../notifications/observer/NotificationPublisher';
import { ISendNotification } from '../notifications/senders/iSendNotification';

// Mock the sendNotification function and use it in the test with 'expect(...).toBeCalled()'
const sendNotificationFunction = jest.fn();

// Generate a mock notification worker
const getNotificationMocker = (): ISendNotification => {
  return {
    sendNotification: sendNotificationFunction,
  };
};

// First overwrite the notification worker with a mock
NotificationWorker.addHandlerOverride('slack', getNotificationMocker());
NotificationWorker.addHandlerOverride('mail', getNotificationMocker());

// Generate a test user
const testUser = new User('Test User', true, true);

describe('Notificaties', () => {
  // First overwrite the notification worker with a mock
  NotificationWorker.addHandlerOverride('slack', getNotificationMocker());
  NotificationWorker.addHandlerOverride('mail', getNotificationMocker());

  test('Er moeten notificatie kunnen worden verstuur naar specifieke gebruikers via Slack en Email', () => {
    // Send test notification
    NotificationPublisher.publish(testUser, 'Test message!');

    // Check if the notification was sent
    expect(sendNotificationFunction).toBeCalled();
  });

  test('Een notificatie moet een prefix decorator hebben', () => {
    // send test notification
    NotificationPublisher.publish(testUser, 'Test message!');
    expect(sendNotificationFunction).toBeCalled();

    // Check if the notification was sent with the correct arguments
    expect(sendNotificationFunction.mock.calls[0][0]).toBe(testUser);
    expect(sendNotificationFunction.mock.calls[0][1]).toContain(
      'you have a new message:'
    );
  });

  test('Geen gebruiker moet slack notificaties uit kunnen zetten', () => {
    // Remove handler override
    NotificationWorker.removeHandlerOverride('slack');
    NotificationWorker.reset();
    // Add mock function to console.log to check if it is called
    console.log = jest.fn();

    // Send test notification
    NotificationPublisher.publish(testUser, 'Test message!');
    expect(console.log).toBeCalledWith(
      expect.stringContaining('Sending Slack notification to Test User')
    );

    // Reset console.log
    console.log = jest.fn();

    // Turn off slack notifications
    testUser.doNotifySlack = false;
    NotificationPublisher.publish(testUser, 'Test message!');
    expect(console.log).not.toBeCalledWith(
      expect.stringContaining('Sending Slack notification to Test User')
    );
  });

  test('Geen gebruiker moet mail notificaties uit kunnen zetten', () => {
    // Remove handler override
    NotificationWorker.removeHandlerOverride('mail');
    NotificationWorker.reset();
    // Add mock function to console.log to check if it is called
    console.log = jest.fn();

    // Send test notification
    NotificationPublisher.publish(testUser, 'Test message!');
    expect(console.log).toBeCalledWith(
      expect.stringContaining('Sending mail notification to Test User')
    );

    // Reset console.log
    console.log = jest.fn();

    // Turn off mail notifications
    testUser.doNotifyEmail = false;
    NotificationPublisher.publish(testUser, 'Test message!');
    expect(console.log).not.toBeCalledWith(
      expect.stringContaining('Sending mail notification to Test User')
    );
  });
});
