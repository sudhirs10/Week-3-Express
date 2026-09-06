import express from 'express';
import multer from 'multer';
import {
  deleteCat,
  getCat,
  getCatById,
  postCat,
  putCat,
} from '../controllers/cat-controller.js';

const catRouter = express.Router();
const upload = multer({dest: 'uploads/'});

catRouter.route('/').get(getCat).post(upload.single('cat'), postCat);

catRouter.route('/:id').get(getCatById).put(putCat).delete(deleteCat);

export default catRouter;
