const config = require('config')
const User = require('../models/User')
const shortid = require('shortid')
const validUri = require('valid-url')
const Link = require('../models/Link')
const Click = require('../models/Click')
const ClicksCollection = require('../models/ClicksCollection')
const ErrorHandler = require('../exceptions/error-handler')
const moment = require('moment');
const color = require('randomcolor');
const countryService = require('../service/country.service')

let baseUrl
if (process.env.NODE_ENV === 'production') {
    baseUrl = process.env.BASE_URL
}
if (process.env.NODE_ENV === 'development') {
    baseUrl = config.get('baseUrl')
}

const validateUrl = (from) => {
    if (from.length === 0) {
        throw ErrorHandler.BadRequest('Link can not be empty')
    }
    if (!validUri.isWebUri(from)) {
        throw ErrorHandler.BadRequest(`${from} is not valid url`)
    }
}
const validateUser = async userId => {
    const currentUser = await User.findOne({_id: userId})

    if (!currentUser) {
        throw ErrorHandler.BadRequest('Unactivated user lifetime expired')
    }

    return currentUser
}
const getDates = (startDate, endDate) => {
    const xDates = []
    let currDate = startDate
        .startOf('day')
    let lastDate = endDate
        .endOf('day')
    while (currDate.diff(lastDate, 'days', true) < 0) {
        xDates.push(currDate)
        currDate = currDate.clone().add(1, 'days')
    }
    return xDates
}

const prepareDashboardData = (linkList, xDates) => {
    const labels = xDates.map(day => day.format('MMM Do'))
    const noClicksArray = xDates.map(el => 0)
    let topCountry
    let topCity
    let clicksCountries = []
    let clicksCities = []
    let datasets = []
    let totalClicks = 0
    linkList.forEach(link => {
        const data = [...noClicksArray]
        totalClicks = totalClicks + link.clicksCollection.clicks.length
        link.clicksCollection.clicks.forEach(({date, country, city}) => {
            const existingCountry = clicksCountries.find(clicksCountry => clicksCountry.country === country)
            if (!existingCountry) {
                clicksCountries.push({
                    country: country,
                    count: 1
                })
            } else {
                existingCountry.count++
            }
            const existingCity = clicksCities.find(clicksCity => clicksCity.city === city)
            if (!existingCity) {
                clicksCities.push({
                    city: city,
                    count: 1
                })
            } else {
                existingCity.count++
            }

            const clickIndex = xDates.findIndex(xDate => xDate.format('MM-DD-YYYY') === moment(+date).format('MM-DD-YYYY'))
            data[clickIndex]++
        })
        let tempTopCity = {
            count: 0
        }
        let tempTopCountry = {
            count: 0
        }
        clicksCountries.forEach(el => {
            if (tempTopCountry.count < el.count) {
                tempTopCountry = el
            }
        })
        clicksCities.forEach(el => {
            if (tempTopCity.count < el.count) {
                tempTopCity = el
            }
        })
        const code = tempTopCountry.country
        topCountry = countryService.getCountryData(code)
        topCity = tempTopCity.city
        datasets.push({
            label: link.title ? link.title : link.to,
            data: data,
            borderColor: 'gray',
            backgroundColor: color({hue: 'orange', luminosity: 'light', format: 'rgb'})
        })

    })
    const dashBoardChartData = {
        labels,
        datasets
    }
    const topPerformersData = {
        topCity,
        topCountry,
        totalClicks
    }

    return {
        dashBoardChartData,
        topPerformersData
    }
}

class LinkController {
    async generate(req, res, next) {
        try {
            const {from, title} = req.body
            validateUrl(from)
            const currentUser = await validateUser(req.user.id)

            const existingLink = await Link.findOne({from, owner: req.user.id})

            if (existingLink) {
                throw ErrorHandler.BadRequest(`You have already created short url for ${existingLink.from}`)
            }

            const code = shortid.generate()

            const to = baseUrl + '/t/' + code

            const link = new Link({
                code, to, from, title, owner: req.user.id, expireAt: undefined
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

    async editLink(req, res, next) {
        try {
            const {from, title} = req.body
            validateUrl(from)
            await validateUser(req.user.id)
            const link = await Link.findOne({from, owner: req.user.id})
            if (!link) {
                throw ErrorHandler.BadRequest('Link not found')
            }

            link.from = from
            link.title = title
            // link = {...link, from: from, title: title}

            await link.save()

            return res.status(201).json({link, message: 'Link updated successfully'})

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
        console.log('getting link details')
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
            const linkId = req.params.id
            const link = await Link.findById(linkId)

            await link.remove()
            if (link.clicksCollection) {
                const deletedClicksCollection = await ClicksCollection.deleteOne({_id: link.clicksCollection})
                console.log('deletedClicksCollection', deletedClicksCollection)

                const deletedClicks = await Click.deleteMany({clicksCollection: link.clicksCollection})
                console.log('deletedClicks', deletedClicks)
            }


            return res.json({id: linkId, message: `Link to ${link.from} successfully removed.`})

        } catch (e) {
            e.message = 'Something went wrong, try again later'
            next(e)
        }
    }

    async getLinkClicks(req, res, next) {
        // console.log('getting clicks for one link')
        try {
            const id = req.params.id
            const link = await Link.findById(id)
                .populate({
                    path: 'clicksCollection',
                    populate: {
                        path: 'clicks',
                        select: 'date country city' //'clientIp country city ' can be added to string after whitespace to get additional fields
                    }
                })
            return res.json(link)
        } catch (e) {
            next(e)
        }
    }

    async getManyLinksClicks(req, res, next) {
        try {
            const {period = 13} = req.body
            const endDate = moment().endOf('day')
            const startDate = period === 30 ? endDate.clone().subtract(1, "months").startOf('day') : endDate.clone().subtract(period, "days").startOf('day')
            const xDates = getDates(startDate, endDate)

            const detailedLinks = await Link.find({owner: req.user.id, clicks: {$gte: 0}})
                .populate({
                    path: 'clicksCollection',
                    select: 'clicks',
                    populate: {
                        path: 'clicks',
                        match: {date: {$gte: startDate, $lte: endDate}},
                        select: 'date country city' //'clientIp country city ' can be added to string after whitespace to get additional fields
                    }
                })

            const dashboardData = prepareDashboardData(detailedLinks, xDates)
            return res.status(200).json(dashboardData)
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

}


module.exports = new LinkController()
