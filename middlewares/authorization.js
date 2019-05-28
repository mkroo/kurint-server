import { getPayload, getToken } from '../utils/jwt';
import models from '../models';

const auth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw({ message: 'Authorization required.' });
        }
        const [type, credential] = authorization.split(' ');
        const types = ['Bearer'];
        if (!credential) {
            throw({ message: 'Authorization type required.' });
        }
        if (!types.includes(type)) {
            throw({ message: 'Unsupported authorization type.' });
        }
        const { id } = await getPayload(credential);
        const user = await models.User.findOne({
            where: { id },
            include: [
                { model: models.Store }
            ]
        });
        if (!user) {
            next({
                status: 404,
                code: 'NOT_FOUND',
                message: 'User not found.'
            });
        }
        req.user = user;
        next();
    } catch (err) {
        const { status, code, message } = err;
        next({
            status: status||400,
            code: code||'AUTHORIZATION_ERROR',
            message: message||'Undefined error.'
        });
    }
}

export default auth;