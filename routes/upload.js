import { Router } from 'express';
import upload from '../utils/upload';
const router = Router();

router.post('/', upload.single('file'), (req, res, next) => {
    res.json({ path: req.file.path.replace(/\\/g, "/") });
});

export default router;