import { AppError } from "./app-error";

export class AuthenticationError extends AppError {
  constructor(message = "Não autenticado") {
    super(message, 401);

    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}
