const ErrorHandler = require('../exceptions/error-handler')

module.exports = function (err, req, res) {
    console.log(err)
    if (err instanceof ErrorHandler) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }

    return res.status(500).json({message: `Uncaught error. Error message is: ${err.message}`})
}
