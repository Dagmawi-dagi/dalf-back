const { app } = require('./app')
const http = require('http')
const { init_io } = require('./socket/socket')

// the server set up
const server = http.createServer(app)
// init the socket connection // if client wants (sends) websocket connection request
init_io(server)


server.listen(8888,()=>{
  console.log('clinic server on port 8888');  
})