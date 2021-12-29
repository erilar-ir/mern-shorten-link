const {Router} = require('express')
const auth = require('../middleware/auth.middleware')
const {generate, getLinks, linkDetails, removeLink, editLink, getLinkClicks, getManyLinksClicks} = require('../controllers/link-controller')

const router = Router()

router.post('/generate', auth, generate)
router.get('/', auth, getLinks)
router.get('/clicks/:id', auth, getLinkClicks)
router.get('/:id', auth, linkDetails)
router.post('/remove/:id', auth, removeLink)
router.post('/many-clicks', auth, getManyLinksClicks)
router.patch('/:id', auth, editLink)
module.exports = router
