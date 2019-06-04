import { Router } from 'express';
import models from '../models';
import calculatePrice from '../utils/calculatePrice';
import auth from '../middlewares/authorization';
const router = Router();

router.post('/', async (req, res, next) => {
    const { name, socialId, provider } = req.body;
    try {
        await models.User.create({ name, socialId, provider });
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

router.delete('/:userId', async (req, res, next) => {
    const { user } = req;
    try {
        await user.destroy();
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

router.get('/:userId', async (req, res, next) => {
    const { userId } = req.params;
    const user = await models.User.findOne({
        attributes: ['id', 'name', 'cash'],
        where: { id: userId }
    });
    res.json({ user });
});

router.post('/:userId/tasks', auth, async (req, res, next) => {
    const { user } = req;
    const { filePath, copies, isSingle, isColor, startPage, endPage, pagesPerSheet, size, storeId } = req.body;
    const taskOptions = { filePath, copies, isSingle, isColor, startPage, endPage, pagesPerSheet, size };
    try {
        const hour = new Date().getUTCHours()+9
        if (hour < 11 || hour >= 19) {
            throw { status: 400, message: '오전 11시 에서 오후 7시 까지만 요청이 가능합니다.'}
        }
        const price = calculatePrice(taskOptions);
        if (user.cash - price < 0) {
            throw {
                status: 400,
                message: '잔액이 부족합니다.'
            }
        }        
        await user.update({ cash: user.cash - price });
        const store = await models.Store.findOne({ where: { id: storeId } });
        await store.update({ cash: store.cash + price });
        const task = await models.Task.create(taskOptions);
        await task.setStore(store);
        await task.setUser(user);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

router.get('/:userId/tasks', async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await models.User.findOne({
            where: { id: userId }
        });
        if (!user) {
            throw {
                status: 404,
                code: 'NOT_FOUND',
                message: 'User not found'
            }
        }
        const tasks = await user.getTasks({ paranoid: false });
        res.json({ tasks });
    } catch (err) {
        next(err);
    }
});

router.post('/:userId/stores', auth, async (req, res, next) => {
    const { user } = req;
    const { name, location } = req.body;
    try {
        const store = await models.Store.create({ name, location });
        await store.setUser(user);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

router.post('/:userId/feedbacks', auth, async (req, res, next) => {
    const { user } = req;
    const { content } = req.body;
    try {
        const feedback = await models.Feedback.create({ content });
        await feedback.setUser(user);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

export default router;