import { body } from 'express-validator';

export const activateResourceValidation = [body('active').isBoolean()];
