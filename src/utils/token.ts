import { User } from "@prisma/client";
import { CustomError } from "../model/CustomError";
import { ResponseModel } from "../model/ResponseModel";
import userService from "../services/UserService";

import jwt, { Secret } from 'jsonwebtoken';

async function generateToken(user: Omit<User, 'user_password' | 'createdAt' | 'updatedAt'>): Promise<{ token: string, expiresIn: string }> {

    const secretKey: Secret = process.env.JWT_SECRET_KEY!;

    const token = jwt.sign({ _id: user.id, name: user.user_name, email: user.email }, secretKey, {
        expiresIn: '1 day',
    });

    return {
        token: token,
        expiresIn: '1 day'
    }
}

async function renewToken(email: string, currentToken: string): Promise<ResponseModel<{ token: string, expiresIn: string }>> {
    if (!email || !currentToken) {
        throw new CustomError("REQUIRED_PROPERTIES_MISSING", 401, "Some required properties are missing from the request.");
    }
    const user = await userService.retrieveUserByEmail(email)

    const decodedToken = jwt.decode(currentToken) as { expiration: number };
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.expiration - currentTime > 300) {
        throw new CustomError("TOKEN_NOT_EXPIRING", 400, "Token is not close to expiring");
    }

    const data = await generateToken(user.data!);

    return {
        data: {
            token: data.token,
            expiresIn: data.expiresIn
        }
    };
}

export { generateToken, renewToken };
