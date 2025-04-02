const fs =  require('fs');
const express =  require('express');
const morgan  = require('morgan');
const cors = require('cors');
const app = express();
const dotEnv = require('dotenv');
dotEnv.config({ path: './config.env'})
const global_erorr_hander = require('./err_handling/global_erorr_hander')
const app_error_feedback = require('./err_handling/app_error_feedback')
// db connection
require('./db conection/db');
// for get,post cors
// for preflight methods put,patch,delete
// on production only ollow the requests from the FRONT-END URI
app.use(cors())
app.options('*', cors())
//3rd party middlewares
const access_log_stream = fs.createWriteStream(__dirname + "/log/access.log", {
  flags:  'a',
});
app.use(morgan("combined", { stream: access_log_stream }));
app.use(morgan('dev'))
// body parser
app.use(express.json())
// static files
app.use(express.static('public'))
// amy uncaughtException
process.on('uncaughtException',(err)=>{
  console.log(err); 
  console.log(`uncaughtException shuting down...`);
  process.exit(1)
  // we should have a tool to restart the app
});
// unhandledRejection
process.on('unhandledRejection',(err)=>{
  console.log(err);
  console.log(`unhandledRejection shuting down...`);
  // shutting down and give the server some time to finish some unfinished requests
  process.exit(1)
  // we should have a tool to restart the app
});
// routes
const routes = require('./routes/routes')
app.use('/api',routes);
// use moment or any other packages
app.get('/api/serverTime',(req,res)=>{
  const yy = new Date().getFullYear()
  const mm = new Date().getMonth()
  const dd = new Date().getDate()
  res.json({
    status: 200,
    // data: `${dd}/${mm}/${yy}`,
    data: `${dd}/${mm+1}/${yy}`,
  })
})
// handling unhandled routes
app.all('*',(req,res,next)=>{
  next(new app_error_feedback(404,`route for '${req.originalUrl}' not found `))
})
// global Error handling middleWare
app.use(global_erorr_hander)
exports.app = app