const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

module.exports = (req, res, next) => {
  const token = req.get('Authorization') || req.body.jwt || req.query.jwt;

  if (!token) {
    next(createError(401, 'no token provided'));
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, decoded) => {
    if (error) {
      next(createError(401, 'invalid token'));
      return;
    }
    if (!decoded.userId) {
      next(createError(400, 'missing user Id in token'));
      return;
    }

    req.apiUserId = decoded.userId;
    try {
      const exists = await userExists(req.apiUserId);
      if (!exists) {
        return next(createError(404, 'User not found'));
      }
    } catch (error) {
      return next(error);
    }

    next();
  });
};

async function userExists(userId) {
  const exists = await Usuario.exists({ _id: userId });
  return exists !== null;
}
