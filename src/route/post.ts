import { PostController } from '../controller/PostController';
import { authenticate } from '../middleware/authenticate';
import { postCommentValidation } from '../validation/post-comment-validation';
import { postValidation } from '../validation/post-validation';

export const PostRoutes = [
  {
    method: 'get',
    route: '/posts',
    controller: PostController,
    action: 'get',
    middleware: authenticate,
    validation: [],
  },
  {
    method: 'get',
    route: '/posts/:id',
    controller: PostController,
    action: 'getOne',
    middleware: authenticate,
    validation: [],
  },
  {
    method: 'post',
    route: '/posts',
    controller: PostController,
    action: 'create',
    middleware: authenticate,
    validation: postValidation,
  },
  {
    method: 'patch',
    route: '/posts/:id',
    controller: PostController,
    action: 'update',
    middleware: authenticate,
    validation: postValidation,
  },
  {
    method: 'delete',
    route: '/posts/:id',
    controller: PostController,
    action: 'delete',
    middleware: authenticate,
    validation: [],
  },
  {
    method: 'post',
    route: '/posts/comment/:id',
    controller: PostController,
    action: 'comment',
    middleware: authenticate,
    validation: postCommentValidation,
  },
  {
    method: 'post',
    route: '/posts/like/:id',
    controller: PostController,
    action: 'like',
    middleware: authenticate,
    validation: [],
  },
];
