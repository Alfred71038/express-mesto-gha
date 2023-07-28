const { ERROR_CODE } = require('./errors');

class ErrorNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE.NOT_FOUND;
  }
}

module.exports = ErrorNotFound;
