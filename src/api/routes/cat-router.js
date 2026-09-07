import express from 'express';
import {body, param} from 'express-validator';

import {upload, createThumbnail} from '../../middlewares/upload.js';
import {authenticateToken} from '../../middlewares/authentication.js';
import {validationErrors} from '../../middlewares/error-handlers.js';

import {
  getCat,
  getCatById,
  getCatsByUserId,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';

const catRouter = express.Router();

catRouter.get('/', getCat);

catRouter.post(
  '/',
  authenticateToken,
  upload.single('cat'),
  body('cat_name').isString().bail().trim().isLength({min: 3, max: 50}),
  body('weight').isFloat({gt: 0}),
  body('birthdate').isDate(),
  validationErrors,
  createThumbnail,
  postCat
);

catRouter.get(
  '/user/:id',
  param('id').isInt({min: 1}),
  validationErrors,
  getCatsByUserId
);

catRouter.get(
  '/:id',
  param('id').isInt({min: 1}),
  validationErrors,
  getCatById
);

catRouter.put(
  '/:id',
  authenticateToken,
  param('id').isInt({min: 1}),
  body('cat_name')
    .optional()
    .isString()
    .bail()
    .trim()
    .isLength({min: 3, max: 50}),
  body('weight').optional().isFloat({gt: 0}),
  body('birthdate').optional().isDate(),
  body('owner').optional().isInt({min: 1}),
  validationErrors,
  putCat
);

catRouter.delete(
  '/:id',
  authenticateToken,
  param('id').isInt({min: 1}),
  validationErrors,
  deleteCat
);

export default catRouter;
