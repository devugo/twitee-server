import { body } from 'express-validator';

export const postValidation = [body('body').isLength({ min: 5 })];
