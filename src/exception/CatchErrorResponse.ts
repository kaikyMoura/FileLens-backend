import { Response } from "express";
import { ResponseError } from "./ResponseError";

export const catchErrorResponse = async (res: Response, statusCode: number, errorCode: string, message: string, errorDescription?: string) => {
    const errorResponse: ResponseError = {
        error_code: errorCode,
        error_description: errorDescription,
    };
    return res.status(statusCode).json({
        statusCode: statusCode,
        message: message,
        errorResponse
    });
};