import { AppError } from "./app-error";

export class AuthorizationError extends AppError {
  constructor(message = "Sem permissão para acessar este recurso") {
    super(message, 403);

    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}
