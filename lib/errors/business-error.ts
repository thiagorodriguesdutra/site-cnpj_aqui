import { AppError } from "./app-error";

export class BusinessError extends AppError {
  public readonly code?: string;

  constructor(message: string, code?: string) {
    super(message, 422);
    this.code = code;

    Object.setPrototypeOf(this, BusinessError.prototype);
  }
}
