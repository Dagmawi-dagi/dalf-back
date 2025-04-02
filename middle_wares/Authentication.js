const userModel = require('../models/user')
const app_error_feedback = require('../err_handling/app_error_feedback')
const catchAsync = require('../features/catchAsync')
const JWT = require('jsonwebtoken')
const { promisify } = require('util')


exports.auth = catchAsync (async (req,res,next)=>{  

    let token;
    //  check if we have token on the req.headers or req.cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) token = req.headers.authorization.split(" ")[1]

    if (!token) return next(new app_error_feedback(401,'please provide access token !!! you need to be logged in'))
    
    // verify the token ...if we don't want to work with callbacks  use "promisify"
    const decoded =  await promisify(JWT.verify)(token,process.env.JWT_SECRET)
    
    // check user if still exists
    const user =  await userModel.model.findById(decoded.id)

    if (!user) return next(new app_error_feedback(401,'the token owner (user) does n\'t exist anymore'))

    // ckeck if the user changed the password after token was given
    if(user.passwordChangedAt){
        const tokenIssueedAtTimestamp = decoded.iat 
        const passwordChangedAtTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000,10) // convert it to milisec
        if ( tokenIssueedAtTimestamp < passwordChangedAtTimestamp ) return next(new app_error_feedback(401, ' user recently changed the password please login again'))        
    }

    // pass the curent user to req.user
    req.user = user
    //then finally to the next middleware or handler
    next()
})