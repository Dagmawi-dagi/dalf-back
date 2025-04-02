const { keys } = require('lodash')
const app_error_feedback = require('./app_error_feedback')
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'globalErrorsLog.log');

// for error loging porposes
let apiurl;
function logErrorToFile(error) {
    const logEntry = `[${new Date().toISOString()}] ${ apiurl }  ${ error.statusCode } ${error.message ?? "no message" }  ${ (error.statusCode >= 500 ? JSON.stringify(error) : "" )}\n`;
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) console.error('Failed to write error to log file:', err);
    });
}


// when we call the next() with err arg this globalerrhandler will be called
module.exports = (err,req,res,next)=>{
    apiurl = req.url // for error loging porposes

    err.statusCode = err.statusCode || 500
    err.status = err.status || Error

    console.log( {global_error_handler: err} ); // but for the res the err to be sent should be handled defferently

    if (process.env.NODE_ENV === 'development') {
        sendErrorOnDev(err,res)
    }

    // handling errors that are Not sent By app_feed_back
    else if (process.env.NODE_ENV === 'production') {
        // user(client err) === operational
        if (err.name === 'CastError' ) {
            const error =  new app_error_feedback(400, `Invalid ${err.path}: ${ err.value}`)
            return   sendErrorOnProd(error,res)
        }
        if (err.code === 11000 ) {
            
            // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
            const error =  new app_error_feedback(400, `${keys(err.keyValue )} already in use`)
            return  sendErrorOnProd(error,res)
        } 
        if (err.name === 'ValidationError') {
            const error = new app_error_feedback(400,`ValidatorError :  ${err.message}`)
            return  sendErrorOnProd(error,res)
        }
        if (err.name === 'JsonWebTokenError') {
            const error = new app_error_feedback(400,`JsonWebTokenError :  ${err.message}`)
            return  sendErrorOnProd(error,res)
        }
        if (err.name === 'TokenExpiredError') {
            const error = new app_error_feedback(400,`TokenExpiredError :  ${err.message}`)
            return  sendErrorOnProd(error,res)
        }

        if( err.name === 'MulterError' && err.code === 'LIMIT_UNEXPECTED_FILE' ){
            const error = new app_error_feedback(400,`Unexpected file uplode OR Unexpected many file uplode with fieldName :  ${err.field} `)
            return  sendErrorOnProd(error,res)
        }
        
        sendErrorOnProd(err,res)
    }

}



function sendErrorOnDev (err,res) {
    // we want to send the whole err stack on dev
    res.status(err.statusCode).json({
        status: err.status,
        errMessage: err.message,
        err,
        stack: err.stack
    })
}

function sendErrorOnProd (err,res) {

    logErrorToFile(err) // Log error to file only on production no need to log when developing

    if (err.isOperational) {
        //for user operational errors
        res.status(err.statusCode).json({
            status: err.status,
            errMessage: err.message
        })
    }
    else{
        res.status(500).json({
            status: 'Error',
            errMessage: 'something went wrong'
        })
    } 
}