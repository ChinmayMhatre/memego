import { Router } from 'express';
import { getPoints } from '../controller/points';

const router = Router();

router.get('/', getPoints);

export default router;