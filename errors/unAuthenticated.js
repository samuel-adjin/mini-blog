const customApiError = require('./customError')
const {StatusCodes} = require("http-status-codes")
class UnAuthenticatedError extends customApiError{
    constructor(message,statusCode){
        super(message)
        statusCode = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = UnAuthenticatedError;