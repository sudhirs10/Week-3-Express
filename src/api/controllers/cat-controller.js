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
    console.log('Form data:', req.body);
    console.log('File data:', req.file);

    if (!req.file) {
      res.status(400).json({
        message: 'Cat image is required.',
      });

      return;
    }

    req.body.filename = req.file.filename;

    const result = await addCat(req.body);

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
    const result = await modifyCat(req.body, catId);

    if (!result) {
      res.status(404).json({
        message: 'Cat not found.',
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
    const result = await removeCat(catId);

    if (!result) {
      res.status(404).json({
        message: 'Cat not found.',
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
