const userService = require('../service/user-service')
const {validationResult} = require('express-validator')
const ErrorHandler = require('../exceptions/error-handler')

const generateRefreshToken = (res, userData) => {
    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false})
    return res.json(userData)
}

const processValidationResult = (req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorsArray = errors.array().map(err => err.msg)
        throw ErrorHandler.BadRequest('Validation error', errorsArray)
    }
}

class UserController {
    async registration(req, res, next) {
        try {
            processValidationResult(req)
            const {email, password} = req.body
            const userData = await userService.registration(email, password)
            return generateRefreshToken(res, userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            processValidationResult(req)
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            return generateRefreshToken(res, userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            // console.log('Refresh Token in server refresh function', refreshToken)
            const userData = await userService.refresh(refreshToken)
            return generateRefreshToken(res, userData)
        } catch (e) {
            next(e)
        }
    }

    async activateLink(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()
