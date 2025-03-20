import { NextFunction, Request, Response } from "express";
import { CustomError } from "../model/CustomError";
import { renewToken } from "../utils/token";
import jwt, { TokenExpiredError, verify } from "jsonwebtoken";

const handleTokenRenewal = async (email: string, token: string, res: Response, req: Request) => {
    try {
        const newTokenData = await renewToken(email, token);

        if (!res.headersSent) {
            console.log("Token renewed successfully.");
            res.setHeader('Authorization', `Bearer ${newTokenData.token}`);
        }

        return true;
    } catch (error) {
        if (error instanceof CustomError && error.message === "TOKEN_NOT_EXPIRING") {
            console.log(error.details);
            return true;
        }
        console.error("Error renewing token:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error.' });
        }
        return false;
    }
}


export default async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'Access denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { email: string };

        const tokenRenewed = await handleTokenRenewal(decoded.email, token, res, req);
        if (tokenRenewed) {
            req.body = decoded;
            next();
        }
        req.body = decoded;
        next();
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            const decoded = jwt.decode(token) as { email: string };

            const tokenRenewed = await handleTokenRenewal(decoded.email, token, res, req);
            if (tokenRenewed) {
                req.body = decoded;
                next();
            }
        } else {
            console.error(err);
            res.status(403).json({ message: 'Invalid token' });
        }

    }
}