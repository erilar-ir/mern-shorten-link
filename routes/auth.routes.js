const {Router} = require('express')
const {registration, login, logout, refresh, activateLink} = require('../controllers/user-controller')
const router = Router()


const {check} = require('express-validator')

router.post('/register',
    check('email').notEmpty().withMessage('Email is required'),
    check('email').isEmail().withMessage('Email is not valid'),
    check('password')
        .isLength({min: 6})
        .withMessage('Password should be at least 6 chars long')
        .matches(/\d/)
        .withMessage('Password must contain a number'),
    registration)
router.post('/login',
    check('email').notEmpty().withMessage('Email is required'),
    check('email').isEmail().withMessage('Email is not valid'),
    check('password')
        .isLength({min: 6})
        .withMessage('Password should be at least 6 chars long'),
    login)
router.post('/logout', logout)
router.get('/activate/:link', activateLink)
router.get('/refresh', refresh)

module.exports = router
