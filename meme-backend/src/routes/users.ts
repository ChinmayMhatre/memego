import express from 'express';
import { createUserObject, getUser } from '../controller/user';
const router = express.Router();

router.post('/user', createUserObject);
router.get('/user/:id', getUser);

export default router;