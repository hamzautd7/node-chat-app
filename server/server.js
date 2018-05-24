const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath= path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
app.use(express.static(publicPath));

const server = app.listen(port, ()=>{
    console.log('Server is up');
});
const io = socketIO(server);

io.on('connection', (socket)=>{
    console.log('New user connected');
   
    socket.emit('newMessage',generateMessage('Admin', 'Welcome to the Chat App'));

    socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined'));
  
   
    socket.on('createMessage', (newMessage, callback)=>{
        console.log('createMessage: ',newMessage);
        
        io.emit('newMessage',generateMessage(newMessage.from, newMessage.text));
        callback();
        // socket.broadcast.emit('newMessage',{
        //      from: newMessage.from,
        //      text: newMessage.text,
        //      createdAt: new Date().getTime() 
        // });
    
    });

    socket.on('createLocationMessage', (coords)=>{
       // console.log(`${coords.latitude}, ${coords.longitude}`);
        io.emit('newLocationMessage', generateLocationMessage('Admin',
    coords.latitude, coords.longitude));
   
});
   
    socket.on('disconnect', ()=>{
        console.log('disconnected from client');
    });


});



