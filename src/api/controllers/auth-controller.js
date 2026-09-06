import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {findUserByUsername} from '../models/user-model.js';
import 'dotenv/config';

const postLogin = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      res.status(400).json({
        message: 'Username and password are required.',
      });

      return;
    }

    const user = await findUserByUsername(username);

    if (!user) {
      res.status(401).json({
        message: 'Incorrect username or password.',
      });

      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      res.status(401).json({
        message: 'Incorrect username or password.',
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

    res.status(500).json({
      message: 'Login failed.',
    });
  }
};

const getMe = (req, res) => {
  const authenticatedUser = res.locals.user;

  if (!authenticatedUser) {
    res.status(401).json({
      message: 'Authentication required.',
    });

    return;
  }

  res.json({
    message: 'Token is valid.',
    user: authenticatedUser,
  });
};

export {postLogin, getMe};
