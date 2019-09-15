const express = require('express')
const app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);
const port = process.env.PORT || 3000
var connections = [];
var users = [];
app.get('/', (req, res) =>
   res.sendFile(__dirname + '/index.html')
)

io.on('connection', (socket) => {
   connections.push(socket);
   console.log('connected: %s users connected', connections.length);

   //disconnect 
   socket.on('disconnect', (data) => {
      users.splice(users.indexOf(socket.userName), 1);
      sendUserNames();
      connections.splice(connections.indexOf(socket), 1);
      console.log('disconnected: %s users connected', connections.length);
   })

   //new message
   socket.on('chat message', (msg) => {
      io.emit('chat message', {
         msg,
         userName: socket.userName
      });
   });

   //new message
   socket.on('new user', (data, callback) => {
      socket.userName = data;
      users.push(socket.userName);
      callback(true);
      sendUserNames();
   });

   function sendUserNames() {
      io.emit('get users', users);
   }
});

server.listen(port, () => console.log(`chat app listening on port ${port}!`))