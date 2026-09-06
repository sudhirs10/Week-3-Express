import express from 'express';
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

userRouter.put('/:id', putUser);

userRouter.delete('/:id', deleteUser);

export default userRouter;
