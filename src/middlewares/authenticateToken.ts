import { NextFunction, Request, Response } from "express";
import { CustomError } from "../model/CustomError";
import { renewToken } from "../utils/token";
import jwt, { verify } from "jsonwebtoken";

export default async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'Access denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { email: string };

        console.log(decoded);
        console.log("Token is valid.");
        try {
            const newTokenData = await renewToken(decoded.email, token);

            if (!res.headersSent) {
                console.log("Token renewed successfully.");
                res.setHeader('Authorization', `Bearer ${newTokenData.data!.token}`);
            }
        } catch (error) {
            if (error instanceof CustomError && error.message === "TOKEN_NOT_EXPIRING") {
                console.log("Token is not close to expiring, continuing without renewal.");
            } else {
                console.error("Error renewing token:", error);

                if (!res.headersSent) {
                    res.status(500).json({ message: 'Server error.' });
                }
                return;
            }
        }

        req.body = decoded;
        next();
    } catch (err) {
        console.error(err);
        res.status(403).json({ message: 'Invalid token' });
    }
}