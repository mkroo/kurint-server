import { Router } from 'express';
import models from '../models';
const router = Router();

router.delete('/:taskId', async (req, res, next) => {
    const { taskId } = req.params;
    await models.Task.destroy({
        id: taskId
    });
    res.status(204).json();
});

export default router;