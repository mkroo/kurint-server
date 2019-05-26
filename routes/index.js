import { Router } from 'express';

import auth from './auth';
import store from './store';
import task from './task';
import user from './user';
import upload from './upload';

const router = Router();

router.use('/auth', auth);
router.use('/stores', store);
router.use('/tasks', task);
router.use('/users', user);
router.use('/uploads', upload);

export default router;