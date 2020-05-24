const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave , getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const PORT = 3000 || process.env.PORT;
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
const bot = 'Admin';
// When client connects
io.on('connection', socket =>{

    
    socket.on('joinRoom',({username, room})=> {

        const user = userJoin(socket.id,username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit('message', formatMessage(bot,'Welcome'));

        // Notify when new user connects
        socket.broadcast
        .to(user.room)
        .emit('message',formatMessage(bot,`${user.username} has joined the room`));
        
        // Send users and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });

        });

    


    // New message
    socket.on('chatMessage', (msg)=>{

        const curUser = getCurrentUser(socket.id);

        io.to(curUser.room).emit('message', formatMessage(curUser.username,msg));
    });

    // Notify when user disconnects
    socket.on('disconnect',()=>{
        const curUser = userLeave(socket.id);
        if(curUser){
        io.to(curUser.room).emit('message',formatMessage(bot,`${curUser.username} has left the room`));
            
        // Send users and room info
        io.to(curUser.room).emit('roomUsers',{
            room: curUser.room,
            users: getRoomUsers(curUser.room)
        });
        }
    });
});

server.listen(3000, ()=> {
    console.log('Server running');
});