// @ts-nocheck
import express from 'express';
import { createUserObject, getUser } from '../controller/user';
const router = express.Router();

router.post('/', createUserObject);
router.get('/:id', getUser);

export default router;