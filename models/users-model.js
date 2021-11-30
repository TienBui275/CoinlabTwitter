const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'must provide name'],
    trim: true,
    maxlength: [20, 'name can not be more than 20 characters'],
  },
  score: {
    type: Number,
    default: 0,
  },
  missioncompleted: {
    type: Boolean,
    default: false,
  },
})

module.exports = mongoose.model('usermodel', UserSchema)