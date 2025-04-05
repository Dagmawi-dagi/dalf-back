const bcrypy = require('bcrypt')
const crypto = require('crypto')
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db conection/db');

const schema = {
  userName:  { type: DataTypes.STRING, allowNull: false, unique: true,defaultValue: 'username' },
  email:{ type: DataTypes.STRING, allowNull: false, unique: true ,
    validate: {
        isEmail: true, 
    }
  },
  phoneNumber:{
    type:  DataTypes.STRING,
    allowNull: false,
    unique: true 
  },
  userPassword: {
    type:  DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 8, 
      notEmpty: true, // Ensures it’s not empty
    },
  },
  avatar:{
    type:  DataTypes.STRING,
    defaultValue: 'jpeg-default.jpeg'
  },
  passwordChangedAt: {type: DataTypes.DATE},
  passwordResetToken: {type: DataTypes.STRING},
  passwordResetExpires: {type: DataTypes.DATE},
  last_logged_in:{
    type:  DataTypes.DATE,
  },
  active:{
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}

const user = sequelize.define('user', schema, {
  tableName: 'users',
  timestamps: true,
  defaultScope: {
    attributes: { exclude: ['userPassword','active'] },
  },
});


//---------- create our relationships--------------//

user.associate = function (models){
  user.hasMany(models.blog, {
    foreignKey: 'createdBy', // Foreign key in the Blog table
  });
}

// hashing the password on save
user.beforeSave("",async function (model){
  // password will only be encrypt on create or update (.save())
  if(model._changed.has('userPassword'))  model.userPassword = await bcrypy.hash(model.userPassword,12)
})

// here only do all the find operation on user that are active: true
user.beforeFind('',function(options){
  options.where = {
    ...options.where,
    active: true
  };
})

// // createPasswordResetToken to be sent via provided email
user.prototype.createPasswordResetToken = function() {
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

module.exports.model = user
module.exports.schema = schema