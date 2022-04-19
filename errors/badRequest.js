const customApiError = require('./customError')
const {StatusCodes} = require("http-status-codes")
class BadRequest extends customApiError{
    constructor(message,statusCode){
        super(message)
        statusCode = StatusCodes.BAD_REQUEST;
    }
}

module.exports = BadRequest;