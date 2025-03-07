var jwt = require('jsonwebtoken');

export default async function generateToken(userId: string): Promise<String> {
    const payload = { id: userId };
    const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key';
    const options = {
        expiresIn: '1h'
    };

    const token = jwt.sign(payload, secretKey, options);

    return token
}