const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose
  .connect('mongodb://localhost:27017/aroundb')
  .then(() => console.log('Conectado a la base de datos!'))
  .catch((err) => console.error(err));
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '68e3f880d5ea21d47450f9cc',
  };
  next();
});
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);
app.use('/', (req, res) => {
  res.status(404).send({ message: 'Recurso solicitado no encontrado' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
