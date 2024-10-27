import { User } from '../models/User';

export class ForumThreadPost {
  constructor(
    private title: string,
    private author: User,
    private message: string
  ) {}
}
