import { CustomError } from "../model/CustomError";
import { ResponseModel } from "../model/ResponseModel";

var jwt = require('jsonwebtoken');

async function generateToken(userId: string): Promise<{ token: string, expiresIn: string }> {
    const payload = { id: userId };
    const secretKey = process.env.JWT_SECRET_KEY || 'secret';
    const options = {
        expiresIn: process.env.JWT_EXPIRATION_TIME || '1h'
    };

    const token = jwt.sign(payload, secretKey, options);

    return {
        token: token,
        expiresIn: options.expiresIn
    }
}

async function renewToken(userId: string, currentToken: string): Promise<ResponseModel<{ token: string, expiresIn: string }>> {
    if (!userId || !currentToken) {
        throw new CustomError("REQUIRED_PROPERTIES_MISSING", 401, "Some required properties are missing from the request.");
    }

    const decodedToken = jwt.decode(currentToken) as { expiration: number };
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.expiration - currentTime > 300) {
        throw new CustomError("TOKEN_NOT_EXPIRING", 400, "Token is not close to expiring");
    }

    const data = await generateToken(userId);

    return {
        data: {
            token: data.token,
            expiresIn: data.expiresIn
        }
    };
}

export { generateToken, renewToken };