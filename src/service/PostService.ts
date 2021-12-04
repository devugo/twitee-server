import { getRepository } from 'typeorm';
import { PAGINATION } from '../constant/PAGINATION';
import { PostDto } from '../dto/post.dto';
import { GetPostsFilterDto } from '../dto/get-posts-filter.dto';
import { Post } from '../entity/Post';
import { User } from '../entity/User';
import { PostCommentService } from './PostCommentService';
import { PostLikeService } from './PostLikeService';
import { PostLike } from '../entity/PostLike';
import { PostCommentDto } from '../dto/post-comment.dto';
import { PostComment } from '../entity/PostComment';

export class PostService {
  private postRepository = getRepository(Post);
  private postLikeRepository = getRepository(PostLike);
  private postCommentRepository = getRepository(PostComment);
  private postCommentService = new PostCommentService();
  private postLikeService = new PostLikeService();

  async get(
    user: User,
    filterDto: GetPostsFilterDto,
  ): Promise<{ count: number; posts: any }> {
    const { page } = filterDto;
    try {
      const query = this.postRepository.createQueryBuilder('post');
      query
        .leftJoinAndSelect('post.user', 'user')
        .select([
          'post.body',
          'post.id',
          'post.createdAt',
          'user.id',
          'user.name',
        ]);
      let posts;
      if (page) {
        query.skip(PAGINATION.itemsPerPage * (parseInt(page) - 1));
        posts = await query.take(PAGINATION.itemsPerPage).getMany();
      } else {
        posts = await query.getMany();
      }

      // Add counts
      const postsWithCommentCountsProm = posts.map((post) =>
        this.postCommentService.count(post.id),
      );
      const postsWithLikeCountsProm = posts.map((post) =>
        this.postLikeService.count(post.id),
      );
      const userLikesProm = posts.map((post) =>
        this.postLikeService.doesUserLike(user.id, post.id),
      );

      const postsWithCommentCounts = await Promise.all(
        postsWithCommentCountsProm,
      ).then((result) => {
        return result;
      });
      const postsWithLikeCounts = await Promise.all(
        postsWithLikeCountsProm,
      ).then((result) => {
        return result;
      });
      const doesUserLikePost = await Promise.all(userLikesProm).then(
        (result) => {
          return result;
        },
      );

      const postsWithCounts = posts.map((post, index) => ({
        ...post,
        likesCount: postsWithLikeCounts[index],
        commentsCount: postsWithCommentCounts[index],
        like: doesUserLikePost[index],
      }));

      const count = await query.getCount();

      return { count, posts: postsWithCounts };
    } catch (error) {
      throw error;
    }
  }

  async getOne(id: string, user: User): Promise<any> {
    try {
      const query = this.postRepository.createQueryBuilder('post');
      query
        .leftJoinAndSelect('post.user', 'user')
        .select([
          'post.body',
          'post.id',
          'post.createdAt',
          'user.id',
          'user.name',
        ])
        .andWhere('post.id = :id', { id });
      const post = await query.getOne();

      if (post) {
        // Add counts
        const likesCount = await this.postLikeService.count(post.id);
        const commentsCount = await this.postCommentService.count(post.id);
        const like = await this.postLikeService.doesUserLike(user.id, post.id);

        //  Get comments
        const comments = await this.postCommentService.getPostComments(post.id);
        return { ...post, likesCount, commentsCount, like, comments };
      } else {
        throw new Error(`Post with ID: ${id} does not exist`);
      }
    } catch (error) {
      throw error;
    }
  }

  async create(user: User, createPostDto: PostDto): Promise<Post> {
    try {
      const { body } = createPostDto;

      const post = this.postRepository.create({
        body,
        user,
      });

      await this.postRepository.save(post);
      const savedPost = await this.getOne(post.id, user);
      return savedPost;
    } catch (error) {
      throw error;
    }
  }

  async update(user: User, id: string, updatePostDto: PostDto): Promise<Post> {
    try {
      const { body } = updatePostDto;

      //  Get Post
      const post = await this.postRepository.findOne({
        where: { user, id },
      });

      if (!post) {
        throw new Error(`Post with ID: ${id} does not exist`);
      }
      post.body = body;

      await this.postRepository.save(post);
      return post;
    } catch (error) {
      throw error;
    }
  }

  async delete(user: User, id: string): Promise<any> {
    try {
      const post = await this.postRepository.findOne({
        where: { user, id },
      });

      if (!post) {
        throw new Error(`Post with ID: ${id} does not exist`);
      }
      const deletePost = await this.postRepository.softDelete(id);
      if (deletePost.affected === 0) {
        throw new Error(`Post with ID:${id} does not exist`);
      }
      return 'Post deleted';
    } catch (error) {
      throw error;
    }
  }

  async like(user: User, id: string): Promise<PostLike | any> {
    try {
      const post = await this.getOne(id, user);
      const userLikesPost = await this.postLikeRepository.findOne({
        user,
        post,
      });

      if (userLikesPost) {
        await this.postLikeRepository.softDelete(userLikesPost.id);
        return await this.getOne(post.id, user);
      }

      const postLike = this.postLikeRepository.create({
        user,
        post,
      });

      await this.postLikeRepository.save(postLike);
      return await this.getOne(post.id, user);
    } catch (error) {
      throw error;
    }
  }

  async comment(
    user: User,
    id: string,
    createPostCommentDto: PostCommentDto,
  ): Promise<PostLike | any> {
    const { comment } = createPostCommentDto;
    try {
      const post = await this.getOne(id, user);

      const postComment = this.postCommentRepository.create({
        user,
        post,
        comment,
      });

      await this.postCommentRepository.save(postComment);
      return await this.getOne(post.id, user);
    } catch (error) {
      throw error;
    }
  }
}
