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

// let onlineCount = 0;

let users = [];


io.sockets.on('connection', socket => {
    let room;

    // Event occurs when a user creates a room
    socket.on('roomCreated', data => {
        room = data.room;

        socket.join(room, () => {
                // console.log(`${data.user} joined room ${data.room}`)
            });

        // Adds the socket id to user info pushed into the array
        let finalUserInfo = {
            id: socket.id,
            ...data
        }

        users.push(finalUserInfo)

        // When host starts game, a random word is generated and sent to all clients in the room
        socket.on('begin', data => {
            axios.get("https://totallynotpictionary.herokuapp.com/api/words/random")
                .then(res => {
                    word = res.data.name;
                })
                .then(_ => {
                    // TODO: CHECK IF THERE AT LEAST 2 PLAYERS IN HERE, IF NOT SEND NOT ENOUGH PLAYERS JOINED

                    // Gets a list of all users currently in this room, pushes them to an array
                    // (so server can pick a random player to become thedrawer)
                    var currentClients = io.sockets.adapter.rooms[data].sockets;
                    currentUsersInRoom = []
                    for (var clientId in currentClients ) {
                        users.forEach(user => {
                            if(user.id === clientId) {
                                currentUsersInRoom.push(user)
                            }
                        })
                    }
                    drawer = currentUsersInRoom[chooseDrawer(currentUsersInRoom.length)]
                    // Send who the drawer is and random word to users in the room
                    io.emit('start', {drawer: drawer.user, word: word, room: data})
                })
                .catch(err => console.log(err))
        })

        const clients = io.sockets.adapter.rooms[data.room].sockets;  
        const numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
        io.emit('users', numClients)
        
    })

    // This removes the waiting for host/click start to begin screen from all clients screens
    // Signalling the game has begun
    socket.on('clearInstructions', () => {
        io.emit('clearInstructions')
    })

    // A user typed the correct answer, send to the rest of the client who this is
    socket.on('correct', data => {
        io.emit('winner', data)
    })

    // Event for when the drawer starts drawing on the canvas
    // Sends the coordinates of the lines to the rest of the clients + the room number
    // (to filter out which room gets these canvas information)
    socket.on("drawing", (data) => {
        let send = {
            room: room,
            ...data
        }
        io.sockets.emit('drawing', send)
        
    });
});

// Returns an index to a user in an array of current players in a room
function chooseDrawer(length) {
    return Math.floor(Math.random()*length) 
}

http.listen(process.env.PORT, function(){
  console.log('listening on :8080');
});