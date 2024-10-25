import { v4 as uuidv4 } from 'uuid';

export class User {
  id: string;

  constructor(
    public readonly name: string,
    public readonly doNotifyEmail: boolean,
    public readonly doNotifySlack: boolean
  ) {
    this.id = uuidv4();
  }
}
