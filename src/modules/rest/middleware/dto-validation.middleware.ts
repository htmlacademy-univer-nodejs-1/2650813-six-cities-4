import { Request, Response, NextFunction } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { IMiddleware } from '../middleware.interface.js';

export class DtoValidationMiddleware implements IMiddleware {
  constructor(private dto: ClassConstructor<object>) {
  }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const instance = plainToInstance(this.dto, req.body);

    if (!instance) {
      res.status(StatusCodes.BAD_REQUEST)
        .json({message: 'Could not create instance from DTO.'});
      return;
    }

    const validationResults = await validate(instance);

    if (validationResults.length > 0) {
      res.status(StatusCodes.BAD_REQUEST)
        .json({
          message: 'Validation error',
          validationResults: validationResults.map((error) => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
      return;
    }

    next();
  }
}
