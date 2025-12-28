import { AppError } from "./app-error";

export class ExternalAPIError extends AppError {
  public readonly api: string;
  public readonly originalError?: unknown;

  constructor(message: string, api: string, originalError?: unknown) {
    super(message, 502);
    this.api = api;
    this.originalError = originalError;

    Object.setPrototypeOf(this, ExternalAPIError.prototype);
  }
}
