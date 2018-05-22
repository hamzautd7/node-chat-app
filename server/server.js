const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath= path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();

const server = app.listen(port, ()=>{
    console.log('Server is up');
});
const io = socketIO(server);

io.on('connection', (socket)=>{
    console.log('New user connected');
    socket.emit('newMessage', {
        from: 'admin',
        text: 'Welcome to the Chat App',
        createdAt:  new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from:'Admin', 
        text: 'New User Joined',
        createdAt:  new Date().getTime()
    })
  
    socket.on('newMessage', (msg)=>{
        console.log('msg: '+ msg);
    });
    socket.on('createMessage', (newMessage)=>{
        console.log('createMessage: ',newMessage);
        // io.emit('newMessage',{
        //     from: newMessage.from,
        //     text: newMessage.text,
        //     createdAt: new Date().getTime()
        // });
        // socket.broadcast.emit('newMessage',{
        //      from: newMessage.from,
        //      text: newMessage.text,
        //      createdAt: new Date().getTime() 
        // });
    
    });
    
    socket.on('disconnect', ()=>{
        console.log('disconnected from client');
    });


});

app.use(express.static(publicPath));

