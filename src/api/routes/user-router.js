import express from 'express';
import {body, param} from 'express-validator';

import {authenticateToken} from '../../middlewares/authentication.js';
import {validationErrors} from '../../middlewares/error-handlers.js';

import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter.get('/', getUser);

userRouter.post(
  '/',
  body('name').isString().bail().trim().notEmpty(),
  body('email').isString().bail().trim().isEmail(),
  body('username')
    .isString()
    .bail()
    .trim()
    .isLength({min: 3, max: 20})
    .isAlphanumeric(),
  body('password').isString().bail().isLength({min: 8}),
  validationErrors,
  postUser
);

userRouter.get(
  '/:id',
  param('id').isInt({min: 1}),
  validationErrors,
  getUserById
);

userRouter.put(
  '/:id',
  authenticateToken,
  param('id').isInt({min: 1}),
  body('name').optional().isString().bail().trim().notEmpty(),
  body('email').optional().isString().bail().trim().isEmail(),
  body('username')
    .optional()
    .isString()
    .bail()
    .trim()
    .isLength({min: 3, max: 20})
    .isAlphanumeric(),
  body('password').optional().isString().bail().isLength({min: 8}),
  body('role').optional().isIn(['user', 'admin']),
  validationErrors,
  putUser
);

userRouter.delete(
  '/:id',
  authenticateToken,
  param('id').isInt({min: 1}),
  validationErrors,
  deleteUser
);

export default userRouter;
