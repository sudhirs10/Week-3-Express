import {
  listAllCats,
  findCatById,
  findCatsByUserId,
  addCat,
  modifyCat,
  removeCat,
} from '../models/cat-model.js';

const getCat = async (req, res, next) => {
  try {
    const cats = await listAllCats();

    res.json(cats);
  } catch (error) {
    console.error('Error getting cats:', error);
    next(error);
  }
};

const getCatById = async (req, res, next) => {
  try {
    const catId = req.params.id;
    const cat = await findCatById(catId);

    if (!cat) {
      const error = new Error('Cat not found.');
      error.status = 404;
      return next(error);
    }

    res.json(cat);
  } catch (error) {
    console.error('Error getting cat:', error);
    next(error);
  }
};

const getCatsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const cats = await findCatsByUserId(userId);

    res.json(cats);
  } catch (error) {
    console.error('Error getting cats by user ID:', error);
    next(error);
  }
};

const postCat = async (req, res, next) => {
  try {
    const authenticatedUser = res.locals.user;

    if (!req.file) {
      const error = new Error('Invalid or missing file');
      error.status = 400;
      return next(error);
    }

    const newCat = {
      cat_name: req.body.cat_name,
      weight: req.body.weight,
      owner: authenticatedUser.user_id,
      filename: req.file.filename,
      birthdate: req.body.birthdate,
    };

    const result = await addCat(newCat);

    if (!result) {
      const error = new Error('Cat was not added.');
      error.status = 400;
      return next(error);
    }

    res.status(201).json({
      message: 'New cat added.',
      result,
    });
  } catch (error) {
    console.error('Error adding cat:', error);
    next(error);
  }
};

const putCat = async (req, res, next) => {
  try {
    const catId = req.params.id;
    const authenticatedUser = res.locals.user;

    const existingCat = await findCatById(catId);

    if (!existingCat) {
      const error = new Error('Cat not found.');
      error.status = 404;
      return next(error);
    }

    const isOwner =
      Number(existingCat.owner) === Number(authenticatedUser.user_id);

    const isAdmin = authenticatedUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      const error = new Error('You cannot update this cat.');
      error.status = 403;
      return next(error);
    }

    const catChanges = {};

    if (req.body.cat_name !== undefined) {
      catChanges.cat_name = req.body.cat_name;
    }

    if (req.body.weight !== undefined) {
      catChanges.weight = req.body.weight;
    }

    if (req.body.birthdate !== undefined) {
      catChanges.birthdate = req.body.birthdate;
    }

    if (isAdmin && req.body.owner !== undefined) {
      catChanges.owner = req.body.owner;
    }

    if (Object.keys(catChanges).length === 0) {
      const error = new Error('No valid fields to update.');
      error.status = 400;
      return next(error);
    }

    const result = await modifyCat(catChanges, catId, authenticatedUser);

    if (!result) {
      const error = new Error('Cat was not updated.');
      error.status = 400;
      return next(error);
    }

    res.json({
      message: 'Cat item updated.',
    });
  } catch (error) {
    console.error('Error updating cat:', error);
    next(error);
  }
};

const deleteCat = async (req, res, next) => {
  try {
    const catId = req.params.id;
    const authenticatedUser = res.locals.user;

    const existingCat = await findCatById(catId);

    if (!existingCat) {
      const error = new Error('Cat not found.');
      error.status = 404;
      return next(error);
    }

    const isOwner =
      Number(existingCat.owner) === Number(authenticatedUser.user_id);

    const isAdmin = authenticatedUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      const error = new Error('You cannot delete this cat.');
      error.status = 403;
      return next(error);
    }

    const result = await removeCat(catId, authenticatedUser);

    if (!result) {
      const error = new Error('Cat was not deleted.');
      error.status = 400;
      return next(error);
    }

    res.json({
      message: 'Cat item deleted.',
    });
  } catch (error) {
    console.error('Error deleting cat:', error);
    next(error);
  }
};

export {getCat, getCatById, getCatsByUserId, postCat, putCat, deleteCat};
