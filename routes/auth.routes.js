const {Router} = require('express')
const {registration, login, logout, refresh, activateLink} = require('../controllers/user-controller')
const router = Router()


const {body} = require('express-validator')

router.post('/register',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 24}),
    registration)
router.post('/login',
    body('email').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 24}),
    login)
router.post('/logout', logout)
router.get('/activate/:link', activateLink)
router.get('/refresh', refresh)

module.exports = router
