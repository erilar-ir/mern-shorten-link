const {Router} = require('express')
const requestIp = require('request-ip');
const {getIpInfo} = require('../service/ip-service')
const Link = require('../models/Link')
const Click = require('../models/Click')
const ClicksCollection = require('../models/ClicksCollection')
const {Types} = require("mongoose");
const User = require("../models/User");
const ErrorHandler = require("../exceptions/error-handler");
const router = Router()

const validateUser = async userId => {
    const currentUser = await User.findOne({_id: userId})

    if (!currentUser) {
        throw ErrorHandler.BadRequest('Unactivated user lifetime expired')
    }

    return currentUser
}

router.get('/:code', async (req, res, next) => {
    try {
        const clientIp = requestIp.getClientIp(req);
        //temporary ip for localhost override
             // const clientIp = '176.37.238.107';
        const link = await Link.findOne({code: req.params.code})
        if (!link) {
            return res.status(404).json({message: 'Link not found'})
        }
        const clicksOwner = validateUser(link.owner)

        link.clicks++

        let clicksCollection = await ClicksCollection.findById(link.clicksCollection)
        if (!clicksCollection) {
            const ownerLink = Types.ObjectId(link._id)
            clicksCollection = new ClicksCollection({
                ownerLink,
                owner: link.owner
            })
            link.clicksCollection = Types.ObjectId(clicksCollection._id)
        }

        const click = new Click({
            clicksCollection: Types.ObjectId(clicksCollection._id),
            owner: link.owner
        })
        if (!clientIp) {
            click.clientIp = 'Not defined'
            click.country = 'Not defined'
            click.city = 'Not defined'
        }
        if (clientIp !== '::1') {
            const ipInfo = getIpInfo(clientIp)
            if (!ipInfo.country) {
                ipInfo.country = 'Not defined'
            }
            if (!ipInfo.city) {
                ipInfo.city = 'Not defined'
            }
            click.clientIp = clientIp
            click.country = ipInfo.country
            click.city = ipInfo.city
        } else {
            click.clientIp = 'localhost'
            click.country = 'localhost'
            click.city = 'localhost'
        }
        clicksCollection.clicks.push(Types.ObjectId(click._id))

        if (!clicksOwner.isActivated) {
            clicksCollection.expireAt = clicksOwner.expireAt
            click.expireAt = clicksOwner.expireAt
        }
        // console.log('ready to save')
        await link.save()
        await clicksCollection.save()
        await click.save()
        return res.redirect(link.from)
    } catch (e) {
        console.log(e)
        e.message = 'Something went wrong, try again later'
        next(e)
    }
})


module.exports = router
