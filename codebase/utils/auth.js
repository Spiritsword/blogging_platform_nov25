const jwt = require('jsonwebtoken');

const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

const authMiddleware = (req, res, next) => {

  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    res.status(400).json({ message: 'Bearer token not supplied or invalid' });
    return;
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token: ' + err.message });
  }

  return req;
}

const signToken = (user) => {

  const payload = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

module.exports = { authMiddleware, signToken };
