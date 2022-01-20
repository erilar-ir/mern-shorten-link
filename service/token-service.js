const jwt = require('jsonwebtoken')
const tokenModel = require('../models/Token')
const bcrypt = require('bcryptjs')
const ErrorHandler = require("../exceptions/error-handler");
const crypto = require('crypto')
const moment = require('moment')


class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1h'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        // console.log('AccessToken: ', accessToken)
        return {
            accessToken,
            refreshToken
        }
    }

   async generateAndSaveResetToken(userDto) {
        try {
            const existingToken = await tokenModel.findOne({user: userDto.id})
            if (existingToken) {
               await tokenModel.deleteMany({user: userDto.id})
            }
            const token = crypto.randomBytes(32).toString('hex')
            const hashedToken = await bcrypt.hash(token, +process.env.BCRYPT_SALT)
            const expireDate = moment().add(1, 'h')
            await tokenModel.create({
                user: userDto.id,
                refreshToken: hashedToken,
                expireAt: expireDate
            })
            return token
        }
        catch (e) {
            console.log(e)
          return null
        }
    }

    async validateResetToken(userId, token) {
        try {
            const passwordResetToken = await tokenModel.findOne({ user: userId })
            if (!passwordResetToken) {
                throw ErrorHandler.UnauthorizedError('Invalid or expired password reset token')
            }
            const isValid = await bcrypt.compare(token, passwordResetToken.refreshToken)
            if (!isValid) {
                throw ErrorHandler.UnauthorizedError('Invalid or expired password reset token')
            }
            return passwordResetToken
        } catch (e) {
            return null
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await tokenModel.create({user: userId, refreshToken})
        return token
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({refreshToken})
        return tokenData

    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData

    }
}

module.exports = new TokenService()
