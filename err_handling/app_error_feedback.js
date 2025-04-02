// to pass err to the next() 
//  const err=  new Error('the message')
//  err.statusCode = 400
//  err.status = 'fail'
//  then pass the err to the next(err)

// But with Class... next(new AppErorr(400,'the message')) done!!!
module.exports = class app_error_feedback extends Error {
    constructor(statusCode=Number,message=String){
        super(message)

        this.statusCode = statusCode
        this.status = String(statusCode).startsWith('4') ? 'fail' : 'Erorr'
        // all the Errors we sent are operational errors (user client errors )
        this.isOperational = true
    }
} 
