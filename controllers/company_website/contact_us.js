const catchAsync = require('../../features/catchAsync');
const app_error_feedback = require('../../err_handling/app_error_feedback');
const Email  = require('../../features/email');
const Joi = require('joi')

exports.contactus = catchAsync(async(req,res,next)=>{
      const { error } = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        subject: Joi.string().required(),
        message: Joi.string().required(),
        phone: Joi.string().required(),
      }).validate(req.body);
      if( error ) {error.name = 'jValidationError';return next(new app_error_feedback(400,error)) }
      
      new Email().contactus({
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
        subject: req.body.subject,
        message: req.body.message
      })
      .then(()=>{
        res.status(200).json({ status: 'success', message: 'Your message has been sent successfully.'})
      })
      .catch((err)=>{
        console.log({'err when sending email': err});
        next(new app_error_feedback(500,'something went wrong please try again'))
      })
})