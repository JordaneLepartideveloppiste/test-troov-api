const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    default: null
  },
  JWT: {
    type: String,
    index: true
  },
  expireAt : {
    type : Date,
    default : Date.now,
    index: true, 
    expires : 0
  },
}, { timestamps: true } );

module.exports = mongoose.model('Session', SessionSchema);
