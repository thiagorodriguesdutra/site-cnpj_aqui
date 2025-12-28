import { AppError } from "./app-error";

export class RateLimitError extends AppError {
  constructor(message = "Muitas requisições. Tente novamente mais tarde.") {
    super(message, 429);
    this.name = "RateLimitError";
  }
}
