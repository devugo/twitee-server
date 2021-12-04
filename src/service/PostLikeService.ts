import { getRepository } from 'typeorm';
import { PostLike } from '../entity/PostLike';

export class PostLikeService {
  private postLikeRepository = getRepository(PostLike);

  async count(post: string): Promise<number> {
    const query = this.postLikeRepository.createQueryBuilder('post_like');
    query.andWhere('post_like.postId = :post', {
      post,
    });
    const count = await query.getCount();
    return count;
  }

  async doesUserLike(user: string, post: string): Promise<boolean> {
    const query = this.postLikeRepository.createQueryBuilder('post_like');
    query.andWhere('post_like.userId = :user AND post_like.postId = :post', {
      user,
      post,
    });
    const count = await query.getCount();
    return count ? true : false;
  }
}
