import { sign, verify } from 'jsonwebtoken';
const secret = 'smk0107';
const issuer = 'https://ansrl.com';

const getToken = (payload) => {
    try {
        return sign(payload, secret, { expiresIn: '12h', issuer });
    } catch (err) {
        throw {
            status: 400,
            code: 'JWT_ENCODE_ERROR',
            message: err.message
        }
    }
}

const getPayload = (token) => {
    try {
        return verify(token, secret, { issuer });
    } catch (err) {
        throw {
            status: 400,
            code: 'JWT_DECODE_ERROR',
            message: err.message
        }
    }
}

export {
    getToken, getPayload
}