import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {findUserByUsername} from '../models/user-model.js';
import 'dotenv/config';
import process from 'node:process';

const postLogin = async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      const error = new Error('Username and password are required.');
      error.status = 400;
      return next(error);
    }

    const user = await findUserByUsername(username);

    if (!user) {
      const error = new Error('Incorrect username or password.');
      error.status = 401;
      return next(error);
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      const error = new Error('Incorrect username or password.');
      error.status = 401;
      return next(error);
    }

    const userWithoutPassword = {
      user_id: user.user_id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      message: 'Login successful.',
      user: userWithoutPassword,
      token: token,
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

const getMe = (req, res, next) => {
  const authenticatedUser = res.locals.user;

  if (!authenticatedUser) {
    const error = new Error('Authentication required.');
    error.status = 401;
    return next(error);
  }

  res.json({
    message: 'Token is valid.',
    user: authenticatedUser,
  });
};

export {postLogin, getMe};
