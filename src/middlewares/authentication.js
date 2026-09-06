import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authenticateToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    res.status(401).json({
      message: 'Authorization token is required.',
    });

    return;
  }

  const headerParts = authorizationHeader.split(' ');

  if (headerParts.length !== 2 || headerParts[0] !== 'Bearer') {
    res.status(401).json({
      message: 'Authorization header is not valid.',
    });

    return;
  }

  const token = headerParts[1];

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    res.locals.user = decodedUser;

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);

    res.status(403).json({
      message: 'Invalid or expired token.',
    });
  }
};

export {authenticateToken};
