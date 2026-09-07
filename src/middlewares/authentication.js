import jwt from 'jsonwebtoken';
import 'dotenv/config';
import process from 'node:process';

const authenticateToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    const error = new Error('Authorization token is required.');
    error.status = 401;
    return next(error);
  }

  const headerParts = authorizationHeader.split(' ');

  if (
    headerParts.length !== 2 ||
    headerParts[0] !== 'Bearer' ||
    !headerParts[1]
  ) {
    const error = new Error('Authorization header is not valid.');
    error.status = 401;
    return next(error);
  }

  const token = headerParts[1];

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    res.locals.user = decodedUser;
  } catch (error) {
    console.error('Token verification error:', error.message);

    const authenticationError = new Error('Invalid or expired token.');
    authenticationError.status = 401;
    return next(authenticationError);
  }

  next();
};

export {authenticateToken};
