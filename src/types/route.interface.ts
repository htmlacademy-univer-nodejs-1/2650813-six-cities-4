import {NextFunction, Request, Response} from 'express';
import {HttpMethod} from './http-method.enum.js';
import {MiddlewareInterface} from '../core/middlewares/middleware.interface.js';

export interface RouteInterface {
  path: string;
  method: HttpMethod;
  handler: (request: Request, response: Response, next: NextFunction) => void;
  middlewares?: MiddlewareInterface[];
}
