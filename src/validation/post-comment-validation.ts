import { body } from 'express-validator';

export const postCommentValidation = [body('comment').isLength({ min: 2 })];
