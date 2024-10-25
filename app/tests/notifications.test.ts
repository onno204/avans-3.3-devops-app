import { User } from '../models/User';
import { NotificationWorker } from '../notifications/NotificationWorker';
import { NotificationPublisher } from '../notifications/observer/NotificationPublisher';
import { iSendNotification } from '../notifications/senders/iSendNotification';

// Mock the sendNotification function and use it in the test with 'expect(...).toBeCalled()'
const sendNotificationFunction = jest.fn();

// Generate a mock notification worker
const getNotificationMocker = (): iSendNotification => {
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
});
