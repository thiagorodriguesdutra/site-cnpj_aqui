import { AppError } from "./app-error";

export class ValidationError extends AppError {
  public readonly field?: string;
  public readonly errors?: Record<string, string[]>;

  constructor(
    message: string,
    field?: string,
    errors?: Record<string, string[]>,
  ) {
    super(message, 400);
    this.field = field;
    this.errors = errors;

    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  static fromZodError(error: {
    errors: Array<{ path: string[]; message: string }>;
  }): ValidationError {
    const errors: Record<string, string[]> = {};

    for (const err of error.errors) {
      const field = err.path.join(".");
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(err.message);
    }

    const firstError = error.errors[0];
    const field = firstError?.path.join(".");
    const message = firstError?.message || "Erro de validação";

    return new ValidationError(message, field, errors);
  }
}
