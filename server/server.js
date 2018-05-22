const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath= path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();

const server = app.listen(3000, ()=>{
    console.log('Server is up');
});
const io = socketIO(server);

io.on('connection', (socket)=>{
    console.log('New user connected');

  
    socket.on('createMessage', (newMessage)=>{
        console.log('createMessage: ',newMessage);
        io.emit('newMessage',{
            from: newMessage.from,
            text: newMessage.text,
            createdAt: new Date().getTime()
        });
    });
    
    socket.on('disconnect', ()=>{
        console.log('disconnected from client');
    });


});

app.use(express.static(publicPath));

