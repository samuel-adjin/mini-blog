const {customApiError} = require('./customError')
const {StatusCodes} = require("http-status-codes")
class UnAuthorizedError extends customApiError{
    constructor(message,statusCode){
        super(message)
        statusCode = StatusCodes.FORBIDDEN;
    }
}

export default UnAuthorizedError;