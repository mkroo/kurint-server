import { Router } from 'express';
import models from '../models';
import calculatePrice from '../utils/calculatePrice';
const router = Router();

router.delete('/:taskId', async (req, res, next) => {
    const { taskId } = req.params;
    await models.Task.destroy({
        where: { id: taskId }
    });
    res.status(204).json();
});

router.patch('/:taskId', auth, async (req, res, next) => {
    const { user } = req;
    const { store } = user;
    const { taskId } = req.params;
    const { status } = req.body; //fetcing, cancel, complete, reject, 
    try {
        await models.Task.update({ status }, {
            where: { id: taskId }
        });
        const task = await models.Task.findOne({ where: { id: taskId }});
        await task.update({ status });
        const price = calculatePrice(task);
        if (status === 'cancel') {
            await user.update({ cash: user.cash + price });
        }
        if (status === 'complete' && store) {
            await store.update({ cash: store.cash + price });
        }
        if (status === 'reject' && store) {
            //포인트 유저에게 돌려줌, 거절 사유, 추후 구현
        }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

export default router;