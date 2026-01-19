const jwt = require('jsonwebtoken');
const ForbiddenError = require('../errors/forbidden-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ForbiddenError('Se requiere autorización');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new ForbiddenError('Se requiere autorización');
  }

  req.user = payload;
  return next();
};
