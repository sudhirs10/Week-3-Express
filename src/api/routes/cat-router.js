import express from 'express';
import multer from 'multer';
import {createThumbnail} from '../../middlewares/upload.js';
import {
  getCat,
  getCatById,
  getCatsByUserId,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';

const catRouter = express.Router();

const upload = multer({
  dest: 'uploads/',
});

catRouter.get('/', getCat);

catRouter.post('/', upload.single('cat'), createThumbnail, postCat);

catRouter.get('/user/:id', getCatsByUserId);

catRouter.get('/:id', getCatById);

catRouter.put('/:id', putCat);

catRouter.delete('/:id', deleteCat);

export default catRouter;
