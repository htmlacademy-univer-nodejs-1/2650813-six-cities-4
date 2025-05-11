import {StatusCodes} from 'http-status-codes';
import {ValidationErrorDetails} from '../../types/validation-error-details.type';

export default class ValidationError extends Error {
  public httpStatusCode!: number;
  public details: ValidationErrorDetails[] = [];

  constructor(message: string, errors: ValidationErrorDetails[]) {
    super(message);

    this.httpStatusCode = StatusCodes.BAD_REQUEST;
    this.message = message;
    this.details = errors;
  }
}
