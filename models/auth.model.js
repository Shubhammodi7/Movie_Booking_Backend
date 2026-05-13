const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },

  role: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'theatreOwner']
  },

  ownedTheatres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre'
  }]
}, {timestamps: true})


userSchema.pre('save', async function () {
  if(!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    logger.error('Error hashing password:', error);
  }
})

userSchema.methods.comparePassword = async function(candidatePassword){
  return bcrypt.compare(candidatePassword, this.password)
}



module.exports = mongoose.model('User', userSchema)