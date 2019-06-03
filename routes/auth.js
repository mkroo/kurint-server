import { Router } from 'express';
import models from '../models';
import { createHash, validateHash } from '../utils/hash';
import { getToken } from '../utils/jwt';
const router = Router();

router.post('/login', async (req, res, next) => {
    const { id, password } = req.body;
    try {
        const user = await models.User.findOne({
            where: { id }
        });
        if (!user) {
            throw({
                status: 404,
                code: 'NOT_FOUND',
                message: '존재하지않는 아이디입니다.'
            });
        }
        const { hash, salt } = user;
        const decode = await validateHash(password, salt);
        if (hash !== decode.hash) {
            throw({
                status: 401,
                code: 'AUTHORIZATION_ERROR',
                message: '아이디와 비밀번호가 맞지않습니다.'
            });
        }
        const store = await user.getStore()      
        const accessToken = getToken({ id, name: user.name, store });
        res.json({ accessToken });
    } catch (err) {
        next(err);
    }
});

router.post('/register', async (req, res, next) => {
    const { id, name, password, role } = req.body;
    try {
        const { hash, salt } = await createHash(password);
        const users = await models.User.findAll();
        const cash = users.length<=100?1000:0;
        await models.User.create({ id, name, hash, salt, role, cash });
        res.status(204).json();
    } catch (err) {
        if (err.name = 'SequelizeValidationError') {
            const { path } = err.errors[0];
            if (path === 'id') {
                err = { status: 400, message: `ID는 4~12자 사이이며, 한글, 특수문자, 공백은 허용되지 않습니다.`}
            } else if (path === 'name') {
                err = { status: 400, message: `이름은 2글자 이상이며, 특수문자, 공백은 허용되지 않습니다.`}
            }
        }
        next(err);
    }
});


export default router;