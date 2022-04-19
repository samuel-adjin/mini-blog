const customApiError = require("./customError");
const { StatusCodes } = require('http-status-codes')

function errorHandlerMiddleware(err,req,res,next){
    if(err instanceof customApiError){
        return res.status(err.statusCode).json({msg:err.message});
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Something went wrong... try again")
}

export default errorHandlerMiddleware;