const catchAsync = require('../features/catchAsync');
const app_error_feedback = require('../err_handling/app_error_feedback');

exports.test = catchAsync(async(req,res,next)=>{
})