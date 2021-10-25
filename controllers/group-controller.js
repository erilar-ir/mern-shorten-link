const Group = require('../models/Group')
const User = require('../models/User')
const Link = require('../models/Link')

const ErrorHandler = require('../exceptions/error-handler')

class GroupController {
    async createGroup(req, res) {

            const {name} = req.body
            const currentUser = await User.findOne({_id: req.user.id}).catch(() => {
                throw ErrorHandler.BadRequest('User lifetime is expired')
            })

            if (name.length === 0) {
                return res.status(400).json({message: `Group name is required`})
            }
            const existingGroup = await Group.findOne({name, owner: req.user.id})

            if (existingGroup) {
                return res.status(400).json({message: `Group with name ${name} already exists`})
            }

            const group = new Group({
                name, owner: req.user.id, expireAt: undefined
            })
            if (!currentUser.isActivated) {
                group.expireAt = currentUser.expireAt
            }

            await group.save()
            return res.status(201).json({message: `Group ${name} created successfully`})


    }

    async removeGroup(req, res, next) {
        try {
            const groupId = req.params.id
            const group = await Group.findById(groupId).catch(() => {
                throw ErrorHandler.BadRequest('Group not found')
            })

            group.remove()

            return res.json({message: `Group ${group.name} has been removed`})
        } catch (e) {
            next(e)
        }

    }
    async getGroups(req, res, next) {
        try {
            const groups = await Group.find({owner: req.user.id})
            return res.json(groups)
        } catch (e) {
            next(e)
        }
    }
    async getGroupDetails(req, res, next) {
        try {
            const groupId = req.params.id
            const user = req.user.id
            const group = await Group.findOne({_id: groupId, owner: user}).populate('links')
            return res.json(group)
        } catch (e) {
            next(e)
        }
    }

    async assignLink(req, res, next) {
        try {
            const {groupId, linkId} = req.body
            const user = req.user.id
            const group = await Group.findOne({_id: groupId, owner: user})
            const link = await Link.findOne({_id: linkId})

            const existingLink = group.links.find(link => link.toString() === linkId)
            if (existingLink) {
                return res.status(400).json({message: `Link ${link.to} was already assigned to ${group.name}. Try another link.`})
            }

            group.links.push(linkId)

            group.save()
            res.status(201).json({message: `Link ${link.to} assigned to ${group.name}`})
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
    async withdrawLink(req, res, next) {
        try {
            const {groupId, linkId} = req.body
            const user = req.user.id
            const group = await Group.findOne({_id: groupId, owner: user})
            const link = await Link.findOne({_id: linkId})

            const existingLink = group.links.find(link => link.toString() === linkId)
            if (!existingLink) {
                return res.status(400).json({message: `There is no ${link.to} assigned to ${group.name}.`})
            }

            group.links = group.links.filter(link => link.toString() !== linkId)

            group.save()
            res.status(201).json({message: `Link ${link.to} withdrawn from ${group.name} `})

        } catch (e) {
            next(e)
        }
    }

}



module.exports = new GroupController()


