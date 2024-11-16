// @ts-nocheck
import { Router } from 'express';
import { sendMemeCoins } from '../controller/contract';

const router = Router();

router.post('/', sendMemeCoins);

export default router;