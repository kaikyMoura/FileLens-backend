export class CustomError extends Error {
    statusCode: number;
    details: string;
  
    constructor(message: string, statusCode: number, details: string) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
  
      this.name = this.constructor.name;
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  