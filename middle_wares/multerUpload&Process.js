// implemented using fuctional programing approch
const multer = require('multer')
const sharp = require('sharp')
const app_error_feedback = require('../err_handling/app_error_feedback')
const catchAsync = require('../features/catchAsync')
const fs = require('fs')
const util = require("util");


exports.fileUpload = ()=>{
  // multer upload middle ware
  const uploadFile = (option) =>{
    // the option for d|t ways of uplaod are.. 
    // {
    //  uploadType: 'single' || 'array' || 'array_'
    //  fileType: 'text/html' || 'image' || 'application/pdf'....
    //  fieldName: 'coverImg' || [{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }] ---? if uploadType === 'array_'
    //  maxCount: 10 // only if uploadType === 'array'
    // },

    const multerUploader =  multer({ 
    storage:  multer.memoryStorage(),
    fileFilter: (req,file,cb)=>{ 
      // here add if no file to be uploaded  
      if(!file.mimetype.startsWith(`${option.fileType}`)) cb(new app_error_feedback(400,`please uplode only ${option.fileType}`),false) 
      else {cb(null,true) }}
    })
    
    // return file uploader middleware W|h is multor
    if ( option.uploadType === 'single' ) return multerUploader.single(option.fieldName)
    if ( option.uploadType === 'array' ) return multerUploader.array(option.fieldName,option.maxCount)
    if ( option.uploadType === 'array_' ) return multerUploader.fields(option.fieldName)
  }

  // for image upload procces the image file 
  const proccessImgUpload = (req,res,next) => {    
    // here proccess the image and save it to ....
    const files = arrayOfFiles(req)
    files.forEach(file=>{ imageProcessor(file) })
    next()
  }

  // save the uploaded file
  const saveFile = (saveOption)=>{

    return catchAsync(async ( req,res,next )=>{
      const writefile = util.promisify(fs.writeFile)
      const mkdir = util.promisify(fs.mkdir)
      const files = arrayOfFiles(req)
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const saveFolder = saveOption.saveFolder
        const isFileImage = file.mimetype.startsWith(`image`) ? true : false
        const fileExtention = isFileImage ? 'jpeg' : file.originalname.split('.')[ file.originalname.split('.').length -1 ]
        // add filename prop to the file object so that we can use the saved file's name on the next middelre ware
        file.filename = `${fileExtention}-${Math.random()}-${Date.now()}.${fileExtention}`;
        // create directory incase there is no created folder
        // the save directory is based on the 'fileExtention' and the 'saveFolder'
        await mkdir(`public/${fileExtention}/${saveFolder}`, { recursive: true })
        await writefile(`public/${fileExtention}/${saveFolder}/${file.filename}`,file.buffer )
      }
      next()
    })

  }

  return{
    uploadFile,
    proccessImgUpload,
    saveFile,
  }

}

// return array of files
function arrayOfFiles  (req) {
  const objectOfFiles = req.file ? [req.file] : req.files
  // Note if the uploadtype === single the files will be [file]
  // Note if the uploadtype === array the  files will be [files]
  // Note if the uploadtype === array_ the  files will be { fieldNameOne: [files], fieldNameTwo: [files],... }
  // so customize it like bellow
  let files  = []
  for (const key in objectOfFiles) {
    const file = objectOfFiles[key]
    files = files.concat(file)
  }
  return files
}


// image file upload proccesor
function imageProcessor  (file){
  sharp(file.buffer)
  .toFormat('jpeg')
  .jpeg({quality: 80})
}