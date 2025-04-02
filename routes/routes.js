const router = require('express').Router();
const app_error_feedback = require('../err_handling/app_error_feedback');
const { auth } = require('../middle_wares/Authentication');
const { restrict_to } = require('../middle_wares/authorization');
const { uploadFile, proccessImgUpload, saveFile } = require('../middle_wares/multerUpload&Process').fileUpload();
const { common_controller } = require('../controllers/common_controllers');
const { controllers_ref } = require('../controllers/controllers_ref');
const { models_ref } = require('../models/models_ref');
const { routes_ref } = require('./route_ref');
const { add_filename_to_reqBody,filter_reqBody,validate_reqBody }  = require('../middle_wares/customize_process_req').customize_process_req();

// creat express route for every ai route we have specified above
for (let i = 0; i < routes_ref.length; i++) {
  const baseUrl = routes_ref[i].base_url
  const controller_file= routes_ref[i].controller_file
  const api = routes_ref[i].api

  for (let i = 0; i < api.length; i++) {
    const { model,common,crud_method } = api[i].controller

    router[api[i].req_method](
      `${baseUrl}${api[i].url}`,
      //auth middleware
      api[i].auth ? auth : (req,res,next) => next(),
      //restriction middleware
      api[i].restrict_to && api[i].restrict_to.length != 0 ? restrict_to(api[i].restrict_to) :  (req,res,next)=> next(),
      // file upload middleware
      api[i].upload && Object.keys(api[i].upload).length != 0 ? uploadFile(api[i].upload) : (req,res,next)=> next(),
      // proccess for image uploads
      api[i].image_upload ? proccessImgUpload : (req,res,next)=> next(),
      // file saving middleware
      (api[i].upload && Object.keys(api[i].upload).length != 0) && api[i].save_file_to ? saveFile({saveFolder: api[i].save_file_to}) : (req,res,next)=> next(),
      // middleware to add other things to the req declared on the route_ref
      (req,res,next)=>{ 
        req.route_ref = api[i] // just pass the routes_ref to the req obj for some other case that are not handled here 
        api[i].upload && Object.keys(api[i].upload).length != 0 ? add_filename_to_reqBody(req,) : '' // so when we save the filename to DB we can get it from req.body.fieldname
        api[i].filter_reqBody_with && api[i].filter_reqBody_with.length != 0  ? filter_reqBody(req,api[i].filter_reqBody_with) : '' // filter the req.body before passing it to the controller
        validate_reqBody(req,next)  // validate the req.body before passing it to the controller based on the model schema
        next() 
      },
      // finally the route controller
      crud_method ? (common && model ? common_controller(models_ref[model].model)[crud_method] : controllers_ref[controller_file][crud_method]) : 
      (req,res,next) => next(new app_error_feedback(500,`crud_method is not correcly defined in the route_ref :  ${api[i]}`) )
    )
  }
}

module.exports = router