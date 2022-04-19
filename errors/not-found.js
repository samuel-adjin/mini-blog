const customApiError = require('./customError')
const {StatusCodes} = require("http-status-codes")
class NotFound extends customApiError{
    constructor(message,statusCode){
        super(message)
        statusCode = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFound;