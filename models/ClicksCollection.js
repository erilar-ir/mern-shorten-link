const {Schema, model, Types} = require('mongoose')


const schema = new Schema({
        clicks: [
            {type: Types.ObjectId, ref: 'Click'}
        ],
        ownerLink: {type: Types.ObjectId, ref: 'Link'},
        owner: {type: Types.ObjectId, ref: 'User'},
        createdAt: {type: Date, default: Date.now},
        expireAt: {type: Date, default: undefined}
    }
)
schema.index({expireAt: 1}, {expireAfterSeconds: 0})

module.exports = model('ClicksCollection', schema)
