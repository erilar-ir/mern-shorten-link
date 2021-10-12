module.exports = class ErrorHandler extends Error {
    status
    errors

    constructor(status, message, errors = []) {
        super(message);
        this.status = status
        this.errors = errors
    }

    static UnauthorizedError(message = 'User is not authorized') {
        throw new ErrorHandler(401, message )
    }

    static BadRequest(message, errors = []) {
        throw new ErrorHandler(400, message, errors)
    }

}
