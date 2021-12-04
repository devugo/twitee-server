import { UserController } from '../controller/UserController';
import { authenticate } from '../middleware/authenticate';
import { userValidation } from '../validation/user-validation';

export const AuthRoutes = [
  {
    method: 'post',
    route: '/auth/register',
    controller: UserController,
    action: 'register',
    middleware: null,
    validation: userValidation,
  },
  {
    method: 'post',
    route: '/auth/login',
    controller: UserController,
    action: 'login',
    middleware: null,
    validation: userValidation,
  },
  {
    method: 'get',
    route: '/auth/retain',
    controller: UserController,
    action: 'retain',
    middleware: authenticate,
    validation: [],
  },
];
