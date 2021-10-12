const ErrorHandler = require("../exceptions/error-handler");
const tokenService = require('../service/token-service')


module.exports = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization
        // console.log('Authorization: ', authorizationHeader)
        if (!authorizationHeader) {
            return next(ErrorHandler.UnauthorizedError('No Authorization Header'))
        }

        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken) {
            return next(ErrorHandler.UnauthorizedError('No Access Token'))
        }
        const userData = tokenService.validateAccessToken(accessToken)
        // console.log('UserData: ', userData)
        if (!userData) {
            return next(ErrorHandler.UnauthorizedError(' Wrong Access Token'))
        }
        req.user = userData
        next()
    } catch (e) {
        return next(ErrorHandler.UnauthorizedError('Authorization Validation Failed'))
    }
}
