const jwt = require('jsonwebtoken')
const config = require('config')

let secret

if (process.env.NODE_ENV === 'production') {
    secret = process.env.JWT_SECRET
}
if (process.env.NODE_ENV === 'development') {
    secret = config.get('jwtSecret')
}

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (token == null) {
            return res.status(401).json({message: 'Not authorized'})
        }

        req.user = jwt.verify(token, secret)

        next()

    } catch (e) {
        res.status(401).json({message: 'Not authorized'})
    }
}
