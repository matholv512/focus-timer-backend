export class CustomError extends Error {
  public statusCode: number
  public field?: string
  constructor(msg: string, statusCode: number, field?: string) {
    super(msg)
    this.statusCode = statusCode
    this.field = field
  }

  toJSON() {
    return this.field
      ? {
          message: this.message,
          field: this.field,
        }
      : {
          message: this.message,
        }
  }
}

export class InternalServerError extends CustomError {
  constructor(msg: string = 'An Internal server error occurred.') {
    super(msg, 500)
  }
}

export class BadRequestError extends CustomError {
  constructor(msg: string = 'Bad Request.', field?: string) {
    super(msg, 400, field)
  }
}

export class NotFoundError extends CustomError {
  constructor(msg: string = 'Not Found.') {
    super(msg, 404)
  }
}

export class ConflictError extends CustomError {
  constructor(msg: string = 'Conflict in data request.') {
    super(msg, 409)
  }
}

export class UnauthorizedError extends CustomError {
  constructor(msg: string = 'Unauthorized.') {
    super(msg, 401)
  }
}

export class ForbiddenError extends CustomError {
  constructor(msg: string = 'Forbidden.') {
    super(msg, 403)
  }
}

export class ValidationErrors extends CustomError {
  public errors: CustomError[]

  constructor(errors: CustomError[]) {
    super('Validation errors occurred.', 400)
    this.errors = errors
  }

  toJSON() {
    return {
      message: this.message,
      errors: this.errors.map((error) => error.toJSON()),
    }
  }
}
