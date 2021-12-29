const {
    Schema,
    model,
    // Types
} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    // links: [{ type: Types.ObjectId, ref: 'Link' }],
    createdAt: {type: Date, default: Date.now},
    expireAt: {type: Date, default: undefined} // you don't need to set this default, but I like it there for semantic clearness
}, {})
schema.index({expireAt: 1}, {expireAfterSeconds: 0})

module.exports = model('User', schema)
