const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
        from: {type: String, required: true},
        to: {type: String, required: true, unique: true},
        code: {type: String, required: true, unique: true},
        title: {type: String},
        date: {type: String, default: Date.now},
        clicks: {type: Number, default: 0},
        clicksCollection: {type: Types.ObjectId, ref: 'ClicksCollection', default: null},
        owner: {type: Types.ObjectId, ref: 'User'},
        createdAt: {type: Date, default: Date.now},
        expireAt: {type: Date, default: undefined}
    }
)
schema.index({expireAt: 1}, {expireAfterSeconds: 0})

module.exports = model('Link', schema)
