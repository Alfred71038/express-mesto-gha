const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

const usersRouter = require('./routes/users');

const cardsRouter = require('./routes/cards');

const { ERROR_CODE } = require('./utils/errors');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Подключение к mongodb.');
  }).catch((error) => {
    console.log(`Ошибка при подключении к mongodb ${error.message}.`);
  });

app.use((req, res, next) => {
  req.user = { _id: '64b3e49a99157b7e11d949a2' };
  next();
});

app.use(bodyParser.json());
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req, res, next) => {
  res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Не существующий запрос' });
  next();
});
app.listen(PORT, () => console.log(`Подключение к порту ${PORT}!`));
