import { Router } from 'express';
import models from '../models';
import { createHash, validateHash } from '../utils/hash';
import { getToken } from '../utils/jwt';
const router = Router();

router.post('/login', async (req, res, next) => {
    const { id, password } = req.body;
    const { role } = req.query;
    try {
        const user = await models.User.findOne({
            where: { id }
        });
        if (!user) {
            throw({
                status: 404,
                code: 'NOT_FOUND',
                message: 'User not found'
            });
        }
        if (role === 'store' && !user.storeId) {
            throw({
                status: 404,
                code: 'NOT_FOUND',
                message: 'Store not found'
            });
        }
        const { hash, salt } = user;
        const decode = await validateHash(password, salt);
        if (hash !== decode.hash) {
            throw({
                status: 401,
                code: 'AUTHORIZATION_ERROR',
                message: 'Password does not match with user'
            });
        }
        const accessToken = getToken({ id, name: user.name, role });
        res.json({ accessToken });
    } catch (err) {
        next(err);
    }
});

router.post('/register', async (req, res, next) => {
    const { id, name, password, role } = req.body;
    try {
        const { hash, salt } = await createHash(password);
        await models.User.create({ id, name, hash, salt, role });
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});


export default router;