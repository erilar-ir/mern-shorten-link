const {Schema, Types, model} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true},
    description: {type: String, default: null},
    links: [
        {type: Types.ObjectId, ref: 'Link'}
        ],
    owner: {type: Types.ObjectId, ref: 'User', required: true},
    createdAt: {type: Date, default: Date.now},
    expireAt: {type: Date, default: undefined}
})

schema.index({expireAt: 1}, {expireAfterSeconds: 0})

module.exports = model('Group', schema)
