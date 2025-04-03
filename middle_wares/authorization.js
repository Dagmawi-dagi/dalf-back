const { models_ref } = require('../models/models_ref');
const catchAsync= require('../features/catchAsync');
const app_error_feedback = require('../err_handling/app_error_feedback');

exports.restrict_to = (roles)=>{ 
  // the passed roles arg is array
  return catchAsync(async (req,res,next)=>{

    // if the roles array is [ids] populate them
      const user = await models_ref.user.model.findByPk(req.user._id,{include: ['role']})
      // const user_roles_Array =  user.role.map(obj=>{ return obj.department_name });

    // if the roles is [String]
      // const user = await models.user.findById(req.user._id)
      // const user_roles_Array =  user.role
      if([...roles].some(auth_values => user_roles_Array.includes(auth_values))) return next()
      else return next( new app_error_feedback(403,`only ${ [...roles].join() } can perform this action` ))
  })

}