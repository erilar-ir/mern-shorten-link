const {Schema, model} = require('mongoose')

const TokenSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    refreshToken: {type: String, required: true},
    expireAt: {type: Date, default: undefined}
})
TokenSchema.index({expireAt: 1}, {expireAfterSeconds: 0})
module.exports = model('Token', TokenSchema)
