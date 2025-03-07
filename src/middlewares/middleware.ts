import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import generateToken from "../utils/token";
var jwt = require('jsonwebtoken');

export default async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Acess denied' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err: Error, user: User) => {
            if (err) {
                // If token expires, tries to generate a new token
                const newToken = generateToken(user.id)

                res.setHeader('Authorization', `Bearer ${newToken}`);

                req.body = user;
                return next();
            }

            req.body = user;
            next();
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
}