import {
  listAllCats,
  findCatById,
  findCatsByUserId,
  addCat,
  modifyCat,
  removeCat,
} from '../models/cat-model.js';

const getCat = async (req, res) => {
  try {
    const cats = await listAllCats();

    res.json(cats);
  } catch (error) {
    console.error('Error getting cats:', error);

    res.status(500).json({
      message: 'Database error.',
    });
  }
};

const getCatById = async (req, res) => {
  try {
    const catId = req.params.id;
    const cat = await findCatById(catId);

    if (!cat) {
      res.status(404).json({
        message: 'Cat not found.',
      });

      return;
    }

    res.json(cat);
  } catch (error) {
    console.error('Error getting cat:', error);

    res.status(500).json({
      message: 'Database error.',
    });
  }
};

const getCatsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const cats = await findCatsByUserId(userId);

    res.json(cats);
  } catch (error) {
    console.error('Error getting cats by user ID:', error);

    res.status(500).json({
      message: 'Database error.',
    });
  }
};

const postCat = async (req, res) => {
  try {
    const authenticatedUser = res.locals.user;

    if (!req.file) {
      res.status(400).json({
        message: 'Cat image is required.',
      });

      return;
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
      res.status(400).json({
        message: 'Cat was not added.',
      });

      return;
    }

    res.status(201).json({
      message: 'New cat added.',
      result,
    });
  } catch (error) {
    console.error('Error adding cat:', error);

    res.status(500).json({
      message: 'Database error.',
    });
  }
};

const putCat = async (req, res) => {
  try {
    const catId = req.params.id;
    const authenticatedUser = res.locals.user;

    const existingCat = await findCatById(catId);

    if (!existingCat) {
      res.status(404).json({
        message: 'Cat not found.',
      });

      return;
    }

    const isOwner =
      Number(existingCat.owner) === Number(authenticatedUser.user_id);

    const isAdmin = authenticatedUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        message: 'You cannot update this cat.',
      });

      return;
    }

    const catChanges = {
      ...req.body,
    };

    if (!isAdmin) {
      delete catChanges.owner;
    }

    const result = await modifyCat(catChanges, catId, authenticatedUser);

    if (!result) {
      res.status(400).json({
        message: 'Cat was not updated.',
      });

      return;
    }

    res.json({
      message: 'Cat item updated.',
    });
  } catch (error) {
    console.error('Error updating cat:', error);

    res.status(500).json({
      message: 'Database error.',
    });
  }
};

const deleteCat = async (req, res) => {
  try {
    const catId = req.params.id;
    const authenticatedUser = res.locals.user;

    const existingCat = await findCatById(catId);

    if (!existingCat) {
      res.status(404).json({
        message: 'Cat not found.',
      });

      return;
    }

    const isOwner =
      Number(existingCat.owner) === Number(authenticatedUser.user_id);

    const isAdmin = authenticatedUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        message: 'You cannot delete this cat.',
      });

      return;
    }

    const result = await removeCat(catId, authenticatedUser);

    if (!result) {
      res.status(400).json({
        message: 'Cat was not deleted.',
      });

      return;
    }

    res.json({
      message: 'Cat item deleted.',
    });
  } catch (error) {
    console.error('Error deleting cat:', error);

    res.status(500).json({
      message: 'Database error.',
    });
  }
};

export {getCat, getCatById, getCatsByUserId, postCat, putCat, deleteCat};
