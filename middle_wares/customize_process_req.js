const { generateJoiSchema } = require('../features/joi_validator');
const { models_ref } = require('../models/models_ref');
const app_error_feedback = require('../err_handling/app_error_feedback')


exports.customize_process_req = ()=>{

  const add_filename_to_reqBody = (req)=>{
      const dataObj = { ...req.body };
      if (req.files && req.files.length > 0) {
          req.files.forEach(file => {
              if (!dataObj[file.fieldname])  dataObj[file.fieldname] = [];
              dataObj[file.fieldname].push(file.filename);
          });
      }
      if (req.file) dataObj[req.file.fieldname] = req.file.filename;
      req.body = {...dataObj}
  }

  const validate_reqBody = (req,next)=> { 
    // validate the req,body based on the mongoose shema you have defined for your modela that is to be used on you controller 
    if( !req.route_ref.controller.model || !req.route_ref.req_body_validation ) return
    const mongooseSchema =  models_ref[req.route_ref.controller.model].schema
    // KEY NOTE :: 
    // strip out fields from the req.body if Not defined on the schema using {stripUnknown: true} option
    const { error } = generateJoiSchema(mongooseSchema,req.route_ref.req_body_validation.schemaName).validate(req.body,{stripUnknown: true})
    if( error )  {
      error.name = 'jValidationError' // to differ the other validation error just for developer ease of use
      next(new app_error_feedback(400,error)) 
      return
    }
  }
  
  // we can use await if needed to make it async
  // const validate_mongoose_schema_byJoi =  async (obj,schema,schemaName,next) => {
  //   return new Promise((resolve, reject) => {
  //     const { error } = generateJoiSchema(schema,schemaName).validate(obj)
  //     if (error) reject(next(new app_error_feedback(400,error)));
  //     else resolve(true);
  //   });
  // }

  const filter_reqBody = (req,filterArray) =>{
    if(!filterArray) return
    const filtered_obj = {}
    filterArray.forEach(key => {
      if ( req.body[key] !== undefined ) filtered_obj[key] = req.body[key];
    });
    req.body = filtered_obj;
  }
  
  return{
    add_filename_to_reqBody,
    validate_reqBody,
    // validate_mongoose_schema_byJoi,
    filter_reqBody,
  }

}