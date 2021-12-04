import { NextFunction, Request, Response } from 'express';
import { UserService } from '../service/UserService';
import { CreateUserDto } from '../dto/create-user-dto';
import { validationResult } from 'express-validator';
import { throwError } from '../helper/throw-error';
import { ERROR_CODE } from '../constant/ERROR_CODE';
import { validationErrorMessage } from '../helper/validation-error-message';

export class UserController {
  private userService = new UserService();

  async register(request: Request, response: Response, next: NextFunction) {
    const { email, password }: CreateUserDto = request.body;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        message: validationErrorMessage(errors.array()),
        success: false,
      });
    }
    try {
      const user = await this.userService.register({ email, password });
      return response.status(201).json(user);
    } catch (error) {
      const err = throwError(error);
      return response.status(err.code).json({
        message:
          err.code === 409 ? 'User with the email already exist' : err.message,
        success: false,
      });
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    const { email, password }: CreateUserDto = request.body;
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        message: validationErrorMessage(errors.array()),
        success: false,
      });
    }
    try {
      const result = await this.userService.login({ email, password });
      return response.status(200).json(result);
    } catch (error) {
      const err = throwError({ code: ERROR_CODE.unathorize }, error.message);
      return response.status(err.code).json({
        message: err.message,
        success: false,
      });
    }
  }

  async retain(request: Request, response: Response, next: NextFunction) {
    const { email } = request.user;

    try {
      const user = await this.userService.retain(email);
      return response.status(200).json(user);
    } catch (err) {
      const error = throwError({ code: ERROR_CODE.notFound });
      return response.status(error.code).json({
        message: error.message,
        success: false,
      });
    }
  }
}
