import {NextFunction, Request, Response} from 'express';
import {jwtVerify} from 'jose';
import {StatusCodes} from 'http-status-codes';
import {createSecretKey} from 'node:crypto';
import {HttpError} from '../errors/http-error.js';
import {MiddlewareInterface} from './middleware.interface.js';

export class AuthenticationMiddleware implements MiddlewareInterface {
  constructor(private readonly jwtSecret: string) {
  }

  public async execute(request: Request, _response: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = request.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const {payload} = await jwtVerify(
        token,
        createSecretKey(this.jwtSecret, 'utf-8')
      );

      request.user = {email: payload.email as string, id: payload.id as string};
      return next();
    } catch {

      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthenticationMiddleware')
      );
    }
  }
}
