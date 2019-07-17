const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const parser = require('body-parser')
const usersRouter = require('./routes/users')
const wordsRouter = require('./routes/words')
const cors = require("cors")

app.use(cors())

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use('/api/users', usersRouter)
app.use('/api/words', usersRouter)

let onlineCount = 0;

let users = [];

io.sockets.on('connection', socket => {

    // users.push(socket.id)
    onlineCount++;

    socket.on('join', (data) => {
        // console.log(data.username)
        if(data.username) {
            users.push(data.username)
            console.log('users ', users.length)
            if(users.length === 2) {
                const drawer = users[chooseDrawer()]
                io.emit('start', drawer)
                console.log(drawer)
            }
        }
        socket.on('disconnect', () => {
            console.log(users)
            users.splice(users.indexOf(data.username), 1)
            console.log('disconnected ', data.username);
            console.log(users);
            onlineCount--;
            // io.emit('left', onlineCount);
        })
        
    })


    console.log('a user connected');

    socket.on("drawing", (data) => {

        socket.broadcast.emit("drawing", data);
        // console.log(data.x)
    });
});

function chooseDrawer() {
    return Math.floor(Math.random()*users.length) 
}

http.listen(8080, function(){
  console.log('listening on :8080');
});