// to catch err on async routeControllers use this err catcher
module.exports =  function catchAsync (asyncFunc) {
    return (req,res,next)=>{
        asyncFunc(req,res,next).catch(err=>{ next(err) })
    }
}