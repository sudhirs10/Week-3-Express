import bcrypt from 'bcrypt';
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
    const safeUsers = [];

    for (const user of users) {
      const userWithoutPassword = {
        user_id: user.user_id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      safeUsers.push(userWithoutPassword);
    }

    res.json(safeUsers);
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

    const userWithoutPassword = {
      user_id: user.user_id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error getting user:', error);

    res.status(500).json({
      message: 'Database error.',
    });
  }
};

const postUser = async (req, res) => {
  try {
    if (!req.body.password) {
      res.status(400).json({
        message: 'Password is required.',
      });

      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: 'user',
    };

    const result = await addUser(newUser);

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
    const authenticatedUser = res.locals.user;

    const isOwnAccount = Number(authenticatedUser.user_id) === Number(userId);

    const isAdmin = authenticatedUser.role === 'admin';

    if (!isOwnAccount && !isAdmin) {
      res.status(403).json({
        message: 'You cannot update this user.',
      });

      return;
    }

    const existingUser = await findUserById(userId);

    if (!existingUser) {
      res.status(404).json({
        message: 'User not found.',
      });

      return;
    }

    const userChanges = {
      ...req.body,
    };

    if (!isAdmin) {
      delete userChanges.role;
    }

    if (userChanges.password) {
      userChanges.password = await bcrypt.hash(userChanges.password, 10);
    }

    const result = await modifyUser(userChanges, userId);

    if (!result) {
      res.status(400).json({
        message: 'User was not updated.',
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
    const authenticatedUser = res.locals.user;

    const isOwnAccount = Number(authenticatedUser.user_id) === Number(userId);

    const isAdmin = authenticatedUser.role === 'admin';

    if (!isOwnAccount && !isAdmin) {
      res.status(403).json({
        message: 'You cannot delete this user.',
      });

      return;
    }

    const existingUser = await findUserById(userId);

    if (!existingUser) {
      res.status(404).json({
        message: 'User not found.',
      });

      return;
    }

    const result = await removeUser(userId);

    if (!result) {
      res.status(400).json({
        message: 'User was not deleted.',
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
