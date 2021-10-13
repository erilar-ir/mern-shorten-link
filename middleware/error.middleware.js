const ErrorHandler = require('../exceptions/error-handler')

module.exports = function (error, request, response, next) {
    console.log(error)
    if (error instanceof ErrorHandler) {
        return response.status(error.status).json({message: error.message, errors: error.errors})
    }

    return response.status(500).json({message: `Uncaught error. Error message is: ${error.message}`})
}
