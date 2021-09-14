const {Router} = require('express')
const config = require('config')
const shortid = require('shortid')
const Link = require('../models/Link')
const auth = require('../middleware/auth.middleware')


const router = Router()
router.post('/generate', auth, async (req, res) => {
    try {
        console.log('Enter Generate')
        const baseUrl = config.get('baseUrl')
        const {from} = req.body

        const existingLink = await Link.findOne({from})

        if (existingLink) {
            return res.json({link: existingLink})
        }

        const code = shortid.generate()

        const to = baseUrl + '/t/' + code

        const  link = new Link({
            code, to, from, owner: req.user.userId
        })

        await link.save()

        res.status(201).json({link})

    } catch (e) {
        res.status(e.status).json({message: 'Something went wrong, try again later'})
    }
})
router.get('/', auth,async (req, res) => {
    try {
    const links = await Link.find({owner: req.user.userId} )
    res.json(links)
    } catch (e) {
        res.status(e.status).json({message: 'Something went wrong, try again later'})
    }
})
router.get('/:id', auth,  async (req, res) => {
    try {
        const link = await Link.findById(req.params.id)
        res.json(link)

    } catch (e) {
        res.status(e.status).json({message: 'Something went wrong, try again later'})
    }
})

module.exports = router
