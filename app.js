const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { createUser, login } = require('./controllers/users');
const auth = require('./middleware/auth');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const NotFoundError = require('./errors/not-found-err');
const { validateUser, validateLogin } = require('./middleware/validation');

const { PORT = 3000 } = process.env;
const app = express();

const allowedCors = [
  'https://pacosclub.mooo.com',
  'http://pacosclub.mooo.com',
  'https://api.pacosclub.mooo.com',
  'http://localhost:3000',
];

mongoose
  .connect('mongodb://localhost:27017/aroundb')
  .then(() => console.log('Conectado a la base de datos!'))
  .catch((err) => console.error(err));

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.status(204).send();
  }

  next();
});

app.use(express.json());
app.use(requestLogger);
app.post('/signin', validateLogin, login);
app.post('/signup', validateUser, createUser);
app.use('/users', auth, usersRoutes);
app.use('/cards', auth, cardsRoutes);
app.use('/', () => {
  throw new NotFoundError('Recurso solicitado no encontrado');
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === 500 ? 'Se ha producido un error en el servidor' : message,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor encendido en el puerto ${PORT}`);
});
