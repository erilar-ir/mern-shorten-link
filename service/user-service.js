const UserModel = require('../models/User')
const LinkModel = require('../models/Link')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const mailService = require('../service/mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ErrorHandler = require('../exceptions/error-handler')
const moment = require('moment')

const createAndSaveTokens = async (user) => {
    const userDto = new UserDto(user)

    const tokens = tokenService.generateToken({...userDto})
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
        ...tokens,
        user: userDto
    }
}

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ErrorHandler.BadRequest(`User with email ${email} already exists`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4()
        try{
            const expireDate = moment().add(7, 'd')
            console.log(expireDate)
            const user = await UserModel.create({email, password: hashPassword, activationLink, expireAt: expireDate})

            await mailService.sendActivationMail(email, `${process.env.BASE_URL}/api/auth/activate/${activationLink}`)

            return createAndSaveTokens(user)

        } catch (e) {
            throw ErrorHandler.BadRequest(e.message, e.errors)
        }


    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ErrorHandler.BadRequest(`Activation link isn't correct: ${activationLink}`)
        }
        user.isActivated = true
        user.expireAt = undefined
        await user.save()
        await LinkModel.updateMany({owner: user._id}, {$unset: {expireAt: 1}})

    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ErrorHandler.BadRequest('User was not found')
        }
        const isPasswordEqual = await bcrypt.compare(password, user.password)
        if (!isPasswordEqual) {
            throw ErrorHandler.BadRequest('Wrong password')
        }

        return createAndSaveTokens(user)

    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ErrorHandler.UnauthorizedError('No refresh token provided')
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw ErrorHandler.UnauthorizedError('Wrong refresh token')
        }
        const user = await UserModel.findById(userData.id)
        return createAndSaveTokens(user)
    }

    async getAllUsers() {
        const users = await UserModel.find()
        return users
    }
}

module.exports = new UserService()