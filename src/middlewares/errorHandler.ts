import { NextFunction, Request, Response } from "express";
import { CustomError } from "../model/CustomError";

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error("Error: ", err)

    if (err instanceof CustomError) {
       res.status(err.statusCode).json({
            errorCode: err.statusCode,
            errorMessage: err.message,
            errorDescription: err.details,
        });
        return;
    }

    res.status(500).json({
        errorCode: 'InternalError',
        errorMessage: 'An unexpected error occurred',
        errorDescription: 'Please try again later.',
    });
    return;
};