const socket = require('socket.io')

let io;
// the socket set up
exports.init_io = (server) => { 
  io  = socket(server,{cors: {origins:["*"] }})
}

io?.on('connection',(socket)=>{
  console.log(`new ws Connection ${ socket.id }`);
  // when this specific connection is disconnected
  socket.on('disconnect',(socket)=>{
    console.log('client is Disconneced');
  })
})

// io.emit('broadcast', /* … */); // emit an event to all connected sockets

// for event
exports.newEventPost = (event)=>{ io.emit('newEvent',event) }
exports.eventPostDeleted = (event)=>{ io.emit('eventDeleted',event) }