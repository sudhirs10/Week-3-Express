import {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  removeUser,
} from '../models/user-model.js';

const getUser = async (req, res) => {
  try {
    const users = await listAllUsers();

    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);

    res.status(500).json({
      message: 'Database error.',
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await findUserById(userId);

    if (!user) {
      res.status(404).json({
        message: 'User not found.',
      });

      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);

    res.status(500).json({
      message: 'Database error.',
    });
  }
};

const postUser = async (req, res) => {
  try {
    const result = await addUser(req.body);

    if (!result) {
      res.status(400).json({
        message: 'User was not added.',
      });

      return;
    }

    res.status(201).json({
      message: 'New user added.',
      result,
    });
  } catch (error) {
    console.error('Error adding user:', error);

    res.status(500).json({
      message: 'Database error.',
    });
  }
};

const putUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await modifyUser(req.body, userId);

    if (!result) {
      res.status(404).json({
        message: 'User not found.',
      });

      return;
    }

    res.json({
      message: 'User item updated.',
    });
  } catch (error) {
    console.error('Error updating user:', error);

    res.status(500).json({
      message: 'Database error.',
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await removeUser(userId);

    if (!result) {
      res.status(404).json({
        message: 'User not found.',
      });

      return;
    }

    res.json({
      message: 'User item deleted.',
    });
  } catch (error) {
    console.error('Error deleting user:', error);

    res.status(500).json({
      message: 'Database error.',
    });
  }
};

export {getUser, getUserById, postUser, putUser, deleteUser};
