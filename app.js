const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;

const app = express();

const { errors } = require('celebrate');

const { ERROR_CODE } = require('./utils/errors');

const router = require('./routes/index');

const err = require('./middlewares/error');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Подключение к mongodb.');
  }).catch((error) => {
    console.log(`Ошибка при подключении к mongodb ${error.message}.`);
  });

app.use(bodyParser.json());

app.use(cookieParser());

app.use(router);

app.use(errors());

app.use(err);

app.use((req, res, next) => {
  res.status(ERROR_CODE.NOT_FOUND).send({ message: 'Не известный запрос' });
  next();
});

app.listen(PORT, () => console.log(`Подключение к порту ${PORT}!`));
