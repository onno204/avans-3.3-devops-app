import { v4 as uuidv4 } from 'uuid';

export class User {
  id: string;

  constructor(
    public readonly name: string,
    public doNotifyEmail: boolean,
    public doNotifySlack: boolean
  ) {
    this.id = uuidv4();
  }
}
