// @ts-nocheck
import express from 'express';
import { createUserObject, getUser, addClaimedPoints } from '../controller/user';
const router = express.Router();

router.post('/', createUserObject);
router.get('/:walletAddress', getUser);
router.post('/:walletAddress/points', addClaimedPoints);

export default router;