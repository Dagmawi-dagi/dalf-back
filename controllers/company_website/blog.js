const { models_ref } = require('../../models/models_ref')
const catchAsync = require('../../features/catchAsync');
const app_error_feedback = require('../../err_handling/app_error_feedback');
const Email = require('../../features/email') // send news letter email every time there if new blog post


// blog reactions controller
exports.blog_reaction = catchAsync(async (req,res,next) =>{
    const { inc,dec,add } =  req.body

    const hasAllFields = ["inc", "dec", "add"].every(field => req.body.hasOwnProperty(field));
    if(!hasAllFields) return next(new app_error_feedback(400,`the req.body doesn't have the neccessary fields` )) 

    // the remove,add will and the local storage of user will guid us the ++inc or --dec the count

    const blog = await  models_ref.blog.model.findById(req.params.id);
    if(!blog) return next(new app_error_feedback(400,`No blog found with this id "${ req.params.id }"` )) 

    const reaction = blog.reactions.find((r) => r.name === req.body.reaction.name &&  r.native === req.body.reaction.native );
    if (reaction && inc) reaction.count++;
    else if(reaction && dec) reaction.count--;
    else if(!reaction && add) blog.reactions.push({ name: req.body.reaction.name, native: req.body.reaction.native, count: 1 });;
    
    await blog.save(); 
    
    res.status(200).json({
        status: 'success',
        data:blog 
    })
});


// blog_comment reactions controller
exports.blog_comment_reaction = catchAsync(async (req,res,next) =>{
    const { inc,dec,add } =  req.body
    // the remove,add will and the local storage of user will guid us the ++inc or --dec the count

    const blog_comment = await  models_ref.blog_comment.model.findById(req.params.id);
    if(!blog_comment) return next(new app_error_feedback(400,`No blog_comment found with this id "${ req.params.id }"` )) 

    const reaction = blog_comment.reactions.find((r) => r.name === req.body.reaction.name &&  r.native === req.body.reaction.native );
    if (reaction && inc) reaction.count++;
    else if(reaction && dec) reaction.count--;
    else if(!reaction && add) blog_comment.reactions.push({ name: req.body.reaction.name, native: req.body.reaction.native, count: 1 });;
    
    await blog_comment.save(); 
    
    res.status(200).json({
        status: 'success',
        data:blog_comment 
    })
});