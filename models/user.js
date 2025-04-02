const mongoose = require('mongoose')
const bcrypy = require('bcrypt')
const crypto = require('crypto')

const schema = {
  userName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true ,
    default: 'username'
  },
  email:{
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true 
  },
  phoneNumber:{
    type: String,
    required: true,
    trim: true,
    unique: true 
  },
  userPassword: {
    type: String,
    trim: true,
    required: true,
    minlength: [8, 'the password must have at least 8 characters'],
    select: false
  },
  avatar:{
    type: String,
    default: 'jpeg-default.jpeg'
  },
  // this should be ref to department if you have many roles(departments)
  // Or just use [String] value if you have small roles
  role: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'department',
    required: true
  }],
  passwordChangedAt: {type:Date},
  passwordResetToken: {type:String},
  passwordResetExpires: {type:Date},
  last_logged_in:{
    type: Date,
  },
  active:{
    type: String,
    default: true,
    // select: false
  }
}
const user_schema = new mongoose.Schema(schema,{timestamps:true})

// hashing the password on save
user_schema.pre('save',async function (next) {
  // password will only be encrypt on create or update (.save())
  if(!this.isModified('userPassword')) return next()
  this.userPassword = await bcrypy.hash(this.userPassword,12)
  next()
})

// here only do all the find operation on user that are active: true
user_schema.pre(/^find/, function (next){
  this.find({active: { $ne: false }})
  next()
})


// createPasswordResetToken to be sent via provided email
user_schema.methods.createPasswordResetToken = function() {
  
  const resetToken = crypto.randomBytes(32).toString("hex");
  // save the incrypted version of the resetToken on th DB
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // only valid for 10 min
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports.model = mongoose.model('user',user_schema)
module.exports.schema = schema