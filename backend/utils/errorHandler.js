class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message); //super is a contructor of Error class which is being inherited
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;