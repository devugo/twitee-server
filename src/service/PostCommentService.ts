import { getRepository } from 'typeorm';
import { PostComment } from '../entity/PostComment';

export class PostCommentService {
  private postCommentRepository = getRepository(PostComment);

  async getPostComments(post: string): Promise<any> {
    const query = this.postCommentRepository.createQueryBuilder('post_comment');
    query
      .leftJoinAndSelect('post_comment.user', 'user')
      .select([
        'post_comment.comment',
        'post_comment.id',
        'post_comment.createdAt',
        'user.id',
        'user.name',
      ])
      .where('post_comment.postId = :post', { post });
    const comments = await query.getMany();
    return comments;
  }

  async count(post: string): Promise<number> {
    const query = this.postCommentRepository.createQueryBuilder('post_comment');
    query.andWhere('post_comment.postId = :post', {
      post,
    });
    const count = await query.getCount();
    return count;
  }
}
