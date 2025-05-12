import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface.js';

export interface IRoute {
  path: string;
  httpMethod: 'get' | 'post' | 'delete' | 'patch' | 'put';
  handler: (request: Request, response: Response, next: NextFunction) => void;
  middlewares?: IMiddleware[];
}
