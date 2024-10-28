import { User } from '../models/User';

export class ForumThreadPost {
  constructor(
    private readonly title: string,
    private readonly author: User,
    private readonly message: string
  ) {}
}
