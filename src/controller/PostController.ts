import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { throwError } from '../helper/throw-error';
import { User } from '../entity/User';
import { PostService } from '../service/PostService';
import { validationResult } from 'express-validator';
import { validationErrorMessage } from '../helper/validation-error-message';

export class PostController {
  private postService = new PostService();
  private userRepository = getRepository(User);

  async get(request: Request, response: Response, next: NextFunction) {
    const { email } = request.user;

    try {
      const user = await this.userRepository.findOne({ email });

      //  Get Posts
      const posts = await this.postService.get(user, request.query);
      return response.status(200).json(posts);
    } catch (error) {
      const err = throwError(error);
      return response.status(err.code).json({
        message: err.message,
        success: false,
      });
    }
  }

  async getOne(request: Request, response: Response, next: NextFunction) {
    const { email } = request.user;
    const id = request.params.id;

    try {
      const user = await this.userRepository.findOne({ email });

      //  Get Post
      const post = await this.postService.getOne(id, user);
      return response.status(200).json(post);
    } catch (error) {
      return response.status(404).json({
        message: error.message,
        success: false,
      });
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const { email } = request.user;

    try {
      const user = await this.userRepository.findOne({ email });

      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response
          .status(400)
          .json({ message: validationErrorMessage(errors.array()) });
      }

      //  Create Post
      const post = await this.postService.create(user, request.body);

      return response.status(201).json(post);
    } catch (error) {
      const err = throwError(error);
      return response.status(err.code).json({
        message: err.message,
        success: false,
      });
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const requestUser = request.user;
    const id = request.params.id;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response
        .status(400)
        .json({ message: validationErrorMessage(errors.array()) });
    }

    try {
      const user = await this.userRepository.findOne({
        email: requestUser.email,
      });
      const updatedPost = await this.postService.update(user, id, request.body);
      return response.status(200).json(updatedPost);
    } catch (error) {
      return response.status(404).json({
        message: error.message,
        success: false,
      });
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    const requestUser = request.user;
    const id = request.params.id;

    try {
      const user = await this.userRepository.findOne({
        email: requestUser.email,
      });
      const deletePost = await this.postService.delete(user, id);

      return response.status(200).json(deletePost);
    } catch (error) {
      return response.status(404).json({
        message: error.message,
        success: false,
      });
    }
  }

  async like(request: Request, response: Response, next: NextFunction) {
    const { email } = request.user;
    const id = request.params.id;

    try {
      const user = await this.userRepository.findOne({ email });

      //  Create Post Like
      const postLike = await this.postService.like(user, id);

      return response.status(201).json(postLike);
    } catch (error) {
      return response.status(404).json({
        message: error.message,
        success: false,
      });
    }
  }

  async comment(request: Request, response: Response, next: NextFunction) {
    const { email } = request.user;
    const id = request.params.id;

    try {
      const user = await this.userRepository.findOne({ email });

      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response
          .status(400)
          .json({ message: validationErrorMessage(errors.array()) });
      }

      //  Create Post Comment
      const postComment = await this.postService.comment(
        user,
        id,
        request.body,
      );

      return response.status(201).json(postComment);
    } catch (error) {
      return response.status(404).json({
        message: error.message,
        success: false,
      });
    }
  }
}
