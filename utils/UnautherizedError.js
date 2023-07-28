const { ERROR_CODE } = require('./errors');

class UnautherizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE.UNAUTHORIZED_ERROR;
  }
}

module.exports = UnautherizedError;
