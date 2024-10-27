import { User } from '../models/User';
import { NotificationPublisher } from '../notifications/observer/NotificationPublisher';
import { BacklogItem } from '../project/Backlog/BacklogItem';
import { ForumThreadPost } from './ForumThreadPost';

export class ForumThread {
  private posts: ForumThreadPost[] = [];

  constructor(
    public readonly title: string,
    public readonly backlogItem: BacklogItem
  ) {
    if (this.backlogItem.isFinished()) {
      throw new Error('Cannot add post to done backlog item');
    }
  }

  addPost(post: ForumThreadPost): void {
    if (this.backlogItem.isFinished()) {
      throw new Error('Cannot add post to done backlog item');
    }
    this.posts.push(post);

    // Notify all project team members
    this.backlogItem.project.currentActiveSprint
      ?.getDevelopers()
      .forEach((user: User) => {
        NotificationPublisher.publish(user, 'New post in forum thread');
      });
  }

  getPosts(): ForumThreadPost[] {
    return this.posts;
  }
}
