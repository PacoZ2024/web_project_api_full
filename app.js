const express = require('express');
const mongoose = require('mongoose');
const { createUser, login } = require('./controllers/users');
const auth = require('./middleware/auth');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose
  .connect('mongodb://localhost:27017/aroundb')
  .then(() => console.log('Conectado a la base de datos!'))
  .catch((err) => console.error(err));
app.use(express.json());
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', auth, usersRoutes);
app.use('/cards', auth, cardsRoutes);
app.use('/', (req, res) => {
  res.status(404).send({ message: 'Recurso solicitado no encontrado' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});
