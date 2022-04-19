const BadRequest = require("./badRequest");
const NotFound = require("./not-found");
const UnAuthenticatedError = require("./unAuthenticated");
const UnAuthorizedError = require("./unAuthorized")
const customApiError = require("./customError");


module.exports = {BadRequest,NotFound,UnAuthenticatedError,UnAuthorizedError,customApiError}