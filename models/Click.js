const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
        clicksCollection: {type: Types.ObjectId, ref: 'ClicksCollection'},
        owner: {type: Types.ObjectId, ref: 'User'},
        clientIp: {type: String, default: null},
        country: {type: String, default: null},
        city: {type: String, default: null},
        date: {type: String, default: Date.now},
        expireAt: {type: Date, default: undefined},

    }
)
schema.index({expireAt: 1}, {expireAfterSeconds: 0})

module.exports = model('Click', schema)
