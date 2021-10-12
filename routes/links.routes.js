const {Router} = require('express')
const auth = require('../middleware/auth.middleware')
const {generate, getLinks, linkDetails, removeLink} = require('../controllers/link-controller')

const router = Router()

router.post('/generate', auth, generate)
router.get('/', auth, getLinks)
router.get('/:id', auth, linkDetails)
router.post('/remove/:id', auth, removeLink)


module.exports = router
