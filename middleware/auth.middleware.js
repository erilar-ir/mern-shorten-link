const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (token == null) {
            return res.status(401).json({message: 'Not authorized'})
        }

        req.user = jwt.verify(token, config.get('jwtSecret'))

        next()

    } catch (e) {
         res.status(401).json({message: 'Not authorized'})
    }
}
