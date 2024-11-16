// @ts-nocheck
import { Router } from 'express';
import { getPoints, getClaimedPoints } from '../controller/points';

const router = Router();

router.get('/', getPoints);
router.get('/:walletAddress', getClaimedPoints);

export default router;