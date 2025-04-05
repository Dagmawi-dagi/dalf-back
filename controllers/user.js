const {models_ref} = require('../models/models_ref')
const catchAsync = require('../features/catchAsync');
const app_error_feedback = require('../err_handling/app_error_feedback');
const Email = require('../features/email')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jsonWebToken = require('jsonwebtoken')
const { Op } = require('sequelize');


exports.sign_up = catchAsync(async (req,res,next) =>{
  const user = await models_ref.user.model.create(req.body)
  user.dataValues.userPassword = undefined // we only want it undefined on the response
  user.dataValues.active = undefined // we only want it undefined on the response
  const token = jsonWebToken.sign({id:user.id},process.env.JWT_SECRET, { expiresIn: process.env.JWT_expiresIn } )
  res.status(200).json({
    status: 'success',
    token,
    data : user
  })
});

exports.sign_in = catchAsync(async(req,res,next)=>{  
  if(!req.body.phoneNumber || !req.body.userPassword) return next(new app_error_feedback(400,'please provide phoneNumber and password') )
  const user = await models_ref.user.model.findOne({where:{phoneNumber: req.body.phoneNumber },attributes:{include: "userPassword"}})
  if (!user || !await bcrypt.compare(req.body.userPassword,user.userPassword)) return next(new app_error_feedback(400,'please provide correct phoneNumber and password'))
  // create token
  const token = jsonWebToken.sign({id:user.id},process.env.JWT_SECRET, { expiresIn: process.env.JWT_expiresIn } )
  user.last_logged_in = Date.now()
  await user.save()
  // to exclude the userPassword field from the doc we send to client but DO NOT CAll .save() right after that 
  user.userPassword = undefined
  res.status(200).json({
    status: 'success',
    token,
    data: user 
  })
});

exports.get_me = catchAsync(async(req, res, next) => {
  const user = await  models_ref.user.model.findByPk(req.user.id);
  res.status(200).json({
    status: 'success',
    data: user
  })
});

exports.get_user = catchAsync(async(req, res, next) => {
  const user = await models_ref.user.model.findByPk(req.params.id);
  res.status(200).json({
    status: 'success',
    data: user
  })
});

exports.update_password = catchAsync(async(req,res,next)=>{
  if(!req.body.currentPassword || !req.body.newPassword) return next(new app_error_feedback(400,'please provide currentPassword and newPassword') )
  const user = await models_ref.user.model.findOne({where: {id : req.user.id}, attributes:{include:['userPassword']} })
  const correct = await bcrypt.compare(req.body.currentPassword,user.userPassword)
  // if the currentpassword and inputed are the same
  if(!correct) return next(new app_error_feedback(400, 'The currentPassword you provided is incorrect'))
  // update the password no need to hash it here we have the Document "pre save" middleware for that
  // and also set the passwordChangedAt
  user.userPassword = req.body.newPassword,
  user.passwordChangedAt = Date.now()
  const updatedUser =  await user.save()
  //give the user new JWT
  const token = jsonWebToken.sign({id:updatedUser.id},process.env.JWT_SECRET, { expiresIn: process.env.JWT_expiresIn } )   
  // to exclude the userPassword field from the doc we send to client
  updatedUser.userPassword = undefined
  res.status(200).json({
    status: 'successs',
    token,
    data: updatedUser
  })
  
});

// update phoneNumber but ask for the currenr password to make sure the user is the owner of the account
exports.update_phoneNumber = catchAsync(async(req,res,next)=>{
  if(!req.body.currentPassword || !req.body.newPhoneNumber) return next(new app_error_feedback(400,'please provide currentPassword and newPhoneNumber') )
  const user = await models_ref.user.model.findOne({where:{id: req.user.id},attributes: {include : ['userPassword']}})
  const correct = await bcrypt.compare(req.body.currentPassword,user.userPassword)
  // if the currentpassword and inputed are the same
  if(!correct) return next(new app_error_feedback(400, 'The currentPassword you provided is incorrect'))
  user.phoneNumber = req.body.newPhoneNumber
  const updatedUser =  await user.save()
  //give the user new JWT
  const token = jsonWebToken.sign({id:updatedUser.id},process.env.JWT_SECRET, { expiresIn: process.env.JWT_expiresIn } )   
  // to exclude the userPassword field from the doc we send to client
  updatedUser.userPassword = undefined
  res.status(200).json({
    status: 'successs',
    token,
    data: updatedUser
  })
});

// update email but ask for the current password to make sure the user is the owner of the account
exports.update_email = catchAsync(async(req,res,next)=>{
  if(!req.body.currentPassword || !req.body.email) return next(new app_error_feedback(400,'please provide currentPassword and newEmail') )
  const user = await models_ref.user.model.findOne({where:{id: req.user.id},attributes: {include : ['userPassword']}})
  const correct = await bcrypt.compare(req.body.currentPassword,user.userPassword)
  // if the currentpassword and inputed are the same
  if(!correct) return next(new app_error_feedback(400, 'The currentPassword you provided is incorrect'))
  // and also set the passwordChangedAt
  user.email = req.body.email,
  user.passwordChangedAt = Date.now()
  const updatedUser =  await user.save()
  //give the user new JWT
  const token = jsonWebToken.sign({id:updatedUser.id},process.env.JWT_SECRET, { expiresIn: process.env.JWT_expiresIn } )   
  // to exclude the userPassword field from the doc we send to client
  updatedUser.userPassword = undefined
  res.status(200).json({
    status: 'successs',
    token,
    data: updatedUser
  })
});

exports.update_me = catchAsync(async(req,res,next)=>{
  if(JSON.stringify(req.body).includes('password')) return next(new app_error_feedback(400, 'this route is not for password updates'))
  // here filter your update obj
  const updateObject = {}
  if(req.body.userName) updateObject.userName = req.body.userName
  if(req.body.email) updateObject.email = req.body.email
  if(req.body.avatar) updateObject.avatar = req.body.avatar
  // find the user and update it by using findByIdAndUpdate only the updated ones will be validated
  let user = await models_ref.user.model.update(updateObject,{where: {id: req.user.id},validate:true,individualHooks: true})
  if (user[0]===1) user = await models_ref.user.model.findByPk(req.user.id)
  //give the user new JWT
  const token = jsonWebToken.sign({id:user._id},process.env.JWT_SECRET, { expiresIn: process.env.JWT_expiresIn } )   
  res.status(200).json({
    status: 'success',
    token,
    data:user
  })
});

exports.forgot_password = catchAsync(async(req,res,next)=>{
  if(!req.body.email) return next( new app_error_feedback(400,'please provide your email to recive reset-token! to your email') )
  const user = await models_ref.user.model.findOne({where:{ email: req.body.email }});
  if(!user){ return next(new app_error_feedback(400,`No user with this email ${ req.body.email }` )) }
  //-resetToken
  const resetToken = user.createPasswordResetToken()
  await user.save({ validate: false });
  //-send resetPassword Email
  new Email().sendPasswordResetEmail({
    email: user.email,
    frontEnd: `${process.env.FRONTENDURL}/reset_password/${resetToken}`,
    userName: user.userName,
    resetToken
  })
  .then(()=>{
    // send the response if the email sending was successfull  
    console.log(`PasswordResetToken sent via email ${ user.email}`);
    res.status(200).json({ status: 'success', message: 'ResetToken is sent to your email'})
  })
  .catch((err)=>{
    // if the email sending was not successfull send Error and try again response
    console.log({'err when sending email': err});
    next(new app_error_feedback(500,'something went wrong please try again'))
  })

});

exports.reset_password = catchAsync(async(req,res,next)=>{
  if(!req.body.newPassword) return next(new app_error_feedback(400,'please provide your newPassword') )

  // create hashToken based on the plainText token 
  // and get the user based on that
  const hash = crypto.createHash("sha256")
  .update(req.params.resetToken)
  .digest("hex");

  const user = await models_ref.user.model.findOne({where:{
    passwordResetToken: hash,
    passwordResetExpires: { [Op.gt]: Date.now() }
  }})

  if(!user) return next( new app_error_feedback(400,'No user with this resetToken OR resetToken has been expired') )

  user.userPassword = req.body.newPassword;
  user.passwordChangedAt = Date.now()
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  const updatedUser =  await user.save();
  // create new login token
  const token = jsonWebToken.sign({id:updatedUser._id},process.env.JWT_SECRET, { expiresIn: process.env.JWT_expiresIn } )
  res.status(200).json({
    status: 'success',
    token,
    data: updatedUser
  })

});

exports.delete_me = catchAsync(async(req,res,next)=>{
  // not deleting the user from the DB just Deactivating the user.
  await models_ref.user.model.update({active: false},{where:{id:req.user.id}})
  res.status(204).json({
    status: 'success'
  })
});