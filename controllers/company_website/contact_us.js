const catchAsync = require('../features/catchAsync');
const app_error_feedback = require('../err_handling/app_error_feedback');
const Email  = require('../../features/email')

exports.contactus = catchAsync(async(req,res,next)=>{
    new Email().contactus({
        email: user.email,
        name: req.body.name,
        phone: req.body.phone,
        subject: req.body.subject,
        content: req.body.content
      })
      .then(()=>{
        res.status(200).json({ status: 'success', message: 'Your message has been sent successfully.'})
      })
      .catch((err)=>{
        console.log({'err when sending email': err});
        next(new app_error_feedback(500,'something went wrong please try again'))
      })

})