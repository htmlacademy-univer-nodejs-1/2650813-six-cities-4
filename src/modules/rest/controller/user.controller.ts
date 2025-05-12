import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from './controller.abstract.js';
import { AuthResponse, CreateUserDto, LoginUserDto, UserDto } from '../dto/user.js';
import asyncHandler from 'express-async-handler';
import { Logger } from 'pino';
import { UserService } from '../../users/user-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import { TokenService } from '../../token-service/token-service.interface.js';
import { User } from '../../users/user-dbo.js';
import mongoose from 'mongoose';
import { DtoValidationMiddleware } from '../middleware/dto-validation.middleware.js';
import { FileUploadMiddleware } from '../middleware/file-upload.middleware.js';
import { Config } from 'convict';
import { AppConfig } from '../../../config.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject('Log') protected readonly logger: Logger,
    @inject('UserService') private readonly userService: UserService,
    @inject('TokenService') private readonly tokenService: TokenService,
    @inject('Config') private readonly config: Config<AppConfig>
  ) {
    super(logger);

    this.registerRoute({
      path: '/users/registry',
      httpMethod: 'post',
      handler: asyncHandler(this.register.bind(this)),
      middlewares: [new DtoValidationMiddleware(CreateUserDto)]
    });

    this.registerRoute({
      path: '/users/login',
      httpMethod: 'post',
      handler: asyncHandler(this.login.bind(this)),
      middlewares: [new DtoValidationMiddleware(LoginUserDto)]
    });

    this.registerRoute({
      path: '/users/login',
      httpMethod: 'delete',
      handler: asyncHandler(this.logout.bind(this))
    });

    this.registerRoute({
      path: '/users/check',
      httpMethod: 'get',
      handler: asyncHandler(this.checkUser.bind(this))
    });
    this.registerRoute({
      path: '/users/avatar',
      httpMethod: 'post',
      handler: asyncHandler(this.setAvatar.bind(this)),
      middlewares: [
        new FileUploadMiddleware(
          this.config.getProperties().UPLOAD_DIRECTORY_PATH,
          'avatars',
          'avatar',
          ['image/jpeg', 'image/png']
        )
      ]
    });
  }

  public async setAvatar(req: Request, res: Response): Promise<void> {
    const { avatar } = req.body;
    const authToken = req.headers.authorization?.split(' ')[1];

    if (!authToken) {
      this.send(res, StatusCodes.UNAUTHORIZED, {message: 'Unauthorized'});
      return;
    }

    const token = await this.tokenService.findById(authToken);
    if (!token) {
      this.send(res, StatusCodes.UNAUTHORIZED, {message: 'Invalid token'});
      return;
    }

    const user = await this.userService.findById(token.userId);
    if (!user) {
      this.send(res, StatusCodes.NOT_FOUND, {message: 'User does not exist'});
      return;
    }

    await this.userService.updateAvatar(user.id, avatar);

    this.ok(res, {avatarUrl: avatar});
  }

  public async register(req: Request<object, object, CreateUserDto>, res: Response): Promise<void> {
    this.logger.info('User registration: ', req.body.email);

    const existUser = await this.userService.findByEmail(req.body.email);

    if (existUser) {
      const errorMessage = `User with email ${req.body.email} already exists`;
      this.logger.error(errorMessage);
      this.send(res, StatusCodes.CONFLICT, {message: errorMessage});
      return;
    }

    const userDbo: User = {
      name: req.body.name,
      email: req.body.email,
      id: new mongoose.Types.ObjectId(req.body.id),
      avatar: 'avatar',
      type: req.body.type,
      favorite: [],
      passwordHash: req.body.password,
    };

    const user = await this.userService.create(userDbo);

    const userResponseDto: UserDto = {
      id: user.email,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatar,
      type: user.type
    };

    const token = user.email;

    const responseData: AuthResponse = {
      token,
      user: userResponseDto
    };

    this.created(res, responseData);
  }

  public async login(req: Request<object, object, LoginUserDto>, res: Response): Promise<void> {
    this.logger.info('User login: ', req.body.email);

    const userFindResult = await this.userService.find({email: req.body.email});
    const user = userFindResult[0];

    if(user.passwordHash !== req.body.password) {
      this.send(res, StatusCodes.UNAUTHORIZED, {message: 'Invalid email or password'});
      return;
    }

    const token = user.email;

    if (!userFindResult) {
      this.send(res, StatusCodes.UNAUTHORIZED, {message: 'Invalid email or password'});
      return;
    }

    await this.tokenService.create({
      userId: user.id,
      refreshToken: token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      userAgent: 'какая разница вообще',
      createdAt: new Date(Date.now())
    });

    const responseData: AuthResponse = {
      token,
      user: {
        id: user.email,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar,
        type: user.type
      }
    };

    this.ok(res, responseData);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      await this.tokenService.delete(token);
    }

    this.noContent(res);
  }

  public async checkUser(req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      this.send(res, StatusCodes.UNAUTHORIZED, {message: 'Unauthorized'});
      return;
    }

    const userId = await this.tokenService.findById(token);

    if (!userId) {
      this.send(res, StatusCodes.UNAUTHORIZED, {message: 'Invalid token'});
      return;
    }

    const user = await this.userService.findById(userId.userId);

    if (!user) {
      this.send(res, StatusCodes.UNAUTHORIZED, {message: 'User does not exist'});
      return;
    }

    this.ok(res, user);
  }
}
