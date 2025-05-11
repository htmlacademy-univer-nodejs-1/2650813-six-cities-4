import {NextFunction, Request, Response} from 'express';
import {MiddlewareInterface} from './middleware.interface.js';
import {HttpError} from '../errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {DocumentExistInterface} from '../../types/document-exist.interface.js';

export class DocumentExistMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: DocumentExistInterface,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {
  }

  public async execute({params}: Request, _response: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    if (!await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found.`,
        'DocumentExistMiddleware'
      );
    }

    next();
  }
}
