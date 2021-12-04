import { body } from 'express-validator';

export const userValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
];
