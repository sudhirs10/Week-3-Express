import express from 'express';
import {authenticateToken} from '../../middlewares/authentication.js';
import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter.get('/', getUser);

userRouter.post('/', postUser);

userRouter.get('/:id', getUserById);

userRouter.put('/:id', authenticateToken, putUser);

userRouter.delete('/:id', authenticateToken, deleteUser);

export default userRouter;
