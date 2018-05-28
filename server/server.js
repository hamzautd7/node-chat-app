const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users}= require('./utils/users');
const publicPath= path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
app.use(express.static(publicPath));

const server = app.listen(port, ()=>{
    console.log('Server is up');
});
const io = socketIO(server);
var users = new Users();

io.on('connection', (socket)=>{
    console.log('New user connected');
   
    socket.on('join', (params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room))
        {
            return callback('Name and room name are required');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);
        io.to(params.room).emit('updateUserList',users.getUserList(params.room));
        socket.emit('newMessage',generateMessage('Admin', 'Welcome to the Chat App'));
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));
        
        callback();
    });
   
    socket.on('createMessage', (newMessage, callback)=>{
       // console.log('createMessage: ',newMessage);
        var user = users.getUser(socket.id);
        if(user && isRealString(newMessage.text))
        {
         io.to(user.room).emit('newMessage',generateMessage(user.name, newMessage.text,));
        }
       callback();
        // socket.broadcast.emit('newMessage',{
        //      from: newMessage.from,
        //      text: newMessage.text,
        //      createdAt: new Date().getTime() 
        // });
    
    });

  
    socket.on('createLocationMessage', (coords)=>{
       // console.log(`${coords.latitude}, ${coords.longitude}`);
       var user = users.getUser(socket.id);
        if(user)
        {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name,
            coords.latitude, coords.longitude));
           
        }
       
});
   
    socket.on('disconnect', ()=>{
        console.log('disconnected from client');

        var user = users.removeUser(socket.id);

        if(user)
        {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });


});



