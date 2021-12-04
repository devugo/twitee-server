import { Post } from '../entity/Post';
import { User } from '../entity/User';

export type PostCommentDto = {
  comment: string;
  user?: User;
  postId?: string;
  post?: Post;
};
