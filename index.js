const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const parser = require('body-parser')
const usersRouter = require('./routes/users')
const wordsRouter = require('./routes/words')
const roomsRouter = require('./routes/rooms')
const cors = require("cors")
const axios = require('axios')

app.use(cors())

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use('/api/users', usersRouter)
app.use('/api/words', wordsRouter)
app.use('/api/rooms', roomsRouter)

let onlineCount = 0;

let users = [];


io.sockets.on('connection', socket => {
    let room;

    socket.on('roomCreated', data => {
        room = data.room;

        socket.join(room, () => {
                console.log(`${data.user} joined room ${data.room}`)
                
            });

        let finalUserInfo = {
            id: socket.id,
            ...data
        }
        users.push(finalUserInfo)
        socket.on('begin', data => {
            axios.get("https://totallynotpictionary.herokuapp.com/api/words/random")
                .then(res => {
                    // console.log(res.data.name);
                    word = res.data.name;
                    console.log('data: ', data)
                })
                // .then(_ => {
                //     // drawer = currentUsersInRoom[chooseDrawer()]
                    
                //     // console.log(drawer.user)
                // })
                .then(_ => {
                    // CHECK IF THERE AT LEAST 2 PLAYERS IN HERE, IF NOT SEND NOT ENOUGH PLAYERS JOINED
                    var currentClients = io.sockets.adapter.rooms[data].sockets;
                    console.log('current clients ', currentClients)
                    currentUsersInRoom = []
                    for (var clientId in currentClients ) {
                        users.forEach(user => {
                            if(user.id === clientId) {
                                currentUsersInRoom.push(user)
                            }
                        })
                        // console.log(currentUsersInRoom)
                    }
                    drawer = currentUsersInRoom[chooseDrawer(currentUsersInRoom.length)]
                    console.log(drawer)
                    io.emit('start', {drawer: drawer.user, word: word, room: data})
                })
                .catch(err => console.log(err))
        })
        console.log(users)
        const clients = io.sockets.adapter.rooms[data.room].sockets;  
        const numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
        io.emit('users', numClients)

        // if(numClients === 1) {
        //     let drawer;
        //     setTimeout(() => {
                
        //     }, 2000)
        // }
        // io.in(room).emit("users", currentUsersInRoom)
        
    })

    socket.on('clearInstructions', () => {
        io.emit('clearInstructions')
    })

    socket.on('correct', data => {
        io.emit('winner', data)
    })

    // socket.on('leavingRoom', room => {
    //     // indexToRemove = users.findIndex(user => {
    //     //     return user.user === data;
    //     // })
    //     // users.splice(indexToRemove, 1)
    //     // console.log('removed ', data)
    //     console.log(room)
    //     socket.leave(room)
    //     console.log('left room')
    //     const clients = io.sockets.adapter.rooms[room].sockets;  
    //     const numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
    //     io.emit('users', numClients)
    // })

    socket.on("drawing", (data) => {
        // console.log(currentUsersInRoom.length)
        // for(let i = 0; i < currentUsersInRoom.length; i++) {
        //     socket.broadcast.to(currentUsersInRoom[i].id).emit("drawing", data);
        //     console.log(currentUsersInRoom[i].id)
        // }
        let send = {
            room: room,
            ...data
        }
        io.sockets.emit('drawing', send)
        // console.log(io.sockets.adapter.rooms[data.room].sockets);

        // io.in(data.room).emit('drawing', data)
        // console.log(socket.id)
        // console.log(io.sockets.adapter.rooms[data.room].sockets);
        // var clients = io.sockets.adapter.rooms[data.room].sockets;

        // for (var clientId in clients ) {
        //     console.log(clientId)
        //     //this is the socket of each client in the room.
        //     // var clientSocket = io.sockets.connected[clientId];

        //     //you can do whatever you need with this
        //     io.to(`${clientId}`).emit('drawing', data);

        // }
        
    });
    
    // users.push(socket.id)
    onlineCount++;

    // socket.on('join', (data) => {
        
    //     // console.log(data.username)
    //     if(data.username) {
    //         users.push(data.username)
    //         console.log('users ', users.length)
            
    //         let word;
    //         axios.get("http://localhost:8080/api/words/random")
    //             .then(res => {
    //                 console.log(res.data.name);
    //                 word = res.data.name;
    //             })
    //             .then(_ => {
    //                 const drawer = users[chooseDrawer()]
    //                 io.emit('start', {drawer: drawer, word: word})
    //                 console.log(drawer)
    //             })
    //             .catch(err => console.log(err))
            
    //     }
    //     socket.on('disconnect', () => {
    //         console.log(users)
    //         users.splice(users.indexOf(data.username), 1)
    //         console.log('disconnected ', data.username);
    //         console.log(users);
    //         onlineCount--;
    //         // io.emit('left', onlineCount);
    //     })
        
    //     socket.on('correct', (word) => {
    //         io.emit('winner', {winner: data.username, word: word})
    //     })
    // })


    console.log('a user connected');
});

function chooseDrawer(length) {
    return Math.floor(Math.random()*length) 
}

http.listen(process.env.PORT || 8080, function(){
  console.log('listening on :8080');
});