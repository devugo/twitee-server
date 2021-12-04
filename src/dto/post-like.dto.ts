import { Post } from '../entity/Post';
import { User } from '../entity/User';

export type PostLikeDto = {
  user?: User;
  postId?: string;
  post?: Post;
};
