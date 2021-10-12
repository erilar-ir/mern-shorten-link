const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
        from: {type: String, required: true},
        to: {type: String, required: true, unique: true},
        code: {type: String, required: true, unique: true},
        date: {type: String, default: Date.now},
        clicks: {type: Number, default: 0},
        owner: {type: Types.ObjectId, ref: 'User'},
        createdAt: {type: Date, default: Date.now},
        expireAt: {type: Date, default: undefined} // you don't need to set this default, but I like it there for semantic clearness
    }
)
schema.index({expireAt: 1}, {expireAfterSeconds: 0})

module.exports = model('Link', schema)
