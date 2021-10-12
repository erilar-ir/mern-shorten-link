const config = require('config')
const User = require('../models/User')
const shortid = require('shortid')
const Link = require('../models/Link')
const ErrorHandler = require('../exceptions/error-handler')


let baseUrl
if (process.env.NODE_ENV === 'production') {
    baseUrl = process.env.BASE_URL
}
if (process.env.NODE_ENV === 'development') {
    baseUrl = config.get('baseUrl')
}

class LinkController {
    async generate(req, res, next) {
        try {
            const {from} = req.body
            if (from.length === 0) {
                throw ErrorHandler.BadRequest('Link can not be empty')
            }
            const currentUser = await User.findOne({_id: req.user.id})

            if (!currentUser) {
                throw ErrorHandler.BadRequest('User lifetime is expired')
            }
            const existingLink = await Link.findOne({from, owner: req.user.id})

            if (existingLink) {
                return res.json({link: existingLink})
            }

            const code = shortid.generate()

            const to = baseUrl + '/t/' + code

            const link = new Link({
                code, to, from, owner: req.user.id, expireAt: undefined
            })

            if (!currentUser.isActivated) {
                link.expireAt = currentUser.expireAt
            }

            await link.save()

            return res.status(201).json({link})
        } catch (e) {
            if (e.message) {
                next(e)
            } else {
                e.message = 'Something went wrong, try again later'
                next(e)
            }
        }
    }

    async getLinks(req, res, next) {
        try {
            const links = await Link.find({owner: req.user.id})
            return res.json(links)
        } catch (e) {
            next(e)
        }
    }

    async linkDetails(req, res, next) {
        try {
            const link = await Link.findById(req.params.id)
                .catch(e => {
                    throw ErrorHandler.BadRequest('Link not found')
                })

            if (link && !link.code) {
                return ErrorHandler.BadRequest('Bad link')
            }

            return res.json(link)

        } catch (e) {
            // e.message = 'Something went wrong. Link not found.'
            next(e)
        }
    }

    async removeLink(req, res, next) {
        try {
            const link = await Link.findById(req.params.id)

            await link.remove()

            return res.json({message: `Link to ${link.from} successfully removed.`})

        } catch (e) {
            e.message = 'Something went wrong, try again later'
            next(e)
        }
    }
}


module.exports = new LinkController()
