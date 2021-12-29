const {Router} = require('express')
const auth = require('../middleware/auth.middleware')
const {createGroup, removeGroup, assignLink, withdrawLink, getGroups, getGroupDetails, editGroup} = require('../controllers/group-controller')

const router = Router()

router.get('/', auth, getGroups)
router.get('/:id', auth, getGroupDetails)
router.post('/create', auth, createGroup)
router.delete('/remove/:id', auth, removeGroup)
router.patch('/assign', auth, assignLink)
router.patch('/withdraw', auth, withdrawLink)
router.patch('/edit/:id', auth, editGroup)



module.exports = router
