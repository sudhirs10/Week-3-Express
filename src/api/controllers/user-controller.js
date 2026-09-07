import bcrypt from 'bcrypt';

import {
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  removeUser,
} from '../models/user-model.js';

const getUser = async (req, res, next) => {
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
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await findUserById(userId);

    if (!user) {
      const error = new Error('User not found.');
      error.status = 404;
      return next(error);
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
    next(error);
  }
};

const postUser = async (req, res, next) => {
  try {
    if (!req.body.password) {
      const error = new Error('Password is required.');
      error.status = 400;
      return next(error);
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
      const error = new Error('User was not added.');
      error.status = 400;
      return next(error);
    }

    res.status(201).json({
      message: 'New user added.',
      result,
    });
  } catch (error) {
    console.error('Error adding user:', error);
    next(error);
  }
};

const putUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const authenticatedUser = res.locals.user;

    const isOwnAccount = Number(authenticatedUser.user_id) === Number(userId);

    const isAdmin = authenticatedUser.role === 'admin';

    if (!isOwnAccount && !isAdmin) {
      const error = new Error('You cannot update this user.');
      error.status = 403;
      return next(error);
    }

    const existingUser = await findUserById(userId);

    if (!existingUser) {
      const error = new Error('User not found.');
      error.status = 404;
      return next(error);
    }

    const userChanges = {};

    if (req.body.name !== undefined) {
      userChanges.name = req.body.name;
    }

    if (req.body.username !== undefined) {
      userChanges.username = req.body.username;
    }

    if (req.body.email !== undefined) {
      userChanges.email = req.body.email;
    }

    if (req.body.password !== undefined) {
      userChanges.password = await bcrypt.hash(req.body.password, 10);
    }

    if (isAdmin && req.body.role !== undefined) {
      userChanges.role = req.body.role;
    }

    if (Object.keys(userChanges).length === 0) {
      const error = new Error('No valid fields to update.');
      error.status = 400;
      return next(error);
    }

    const result = await modifyUser(userChanges, userId);

    if (!result) {
      const error = new Error('User was not updated.');
      error.status = 400;
      return next(error);
    }

    res.json({
      message: 'User item updated.',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const authenticatedUser = res.locals.user;

    const isOwnAccount = Number(authenticatedUser.user_id) === Number(userId);

    const isAdmin = authenticatedUser.role === 'admin';

    if (!isOwnAccount && !isAdmin) {
      const error = new Error('You cannot delete this user.');
      error.status = 403;
      return next(error);
    }

    const existingUser = await findUserById(userId);

    if (!existingUser) {
      const error = new Error('User not found.');
      error.status = 404;
      return next(error);
    }

    const result = await removeUser(userId);

    if (!result) {
      const error = new Error('User was not deleted.');
      error.status = 400;
      return next(error);
    }

    res.json({
      message: 'User item deleted.',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    next(error);
  }
};

export {getUser, getUserById, postUser, putUser, deleteUser};
