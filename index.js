const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const parser = require('body-parser')
const usersRouter = require('./routes/users')
const wordsRouter = require('./routes/words')
const cors = require("cors")
const axios = require('axios')

app.use(cors())

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use('/api/users', usersRouter)
app.use('/api/words', wordsRouter)

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
            
            let word;
            axios.get("http://localhost:8080/api/words/random")
                .then(res => {
                    console.log(res.data.name);
                    word = res.data.name;
                })
                .then(_ => {
                    const drawer = users[chooseDrawer()]
                    io.emit('start', {drawer: drawer, word: word})
                    console.log(drawer)
                })
                .catch(err => console.log(err))
            
        }
        socket.on('disconnect', () => {
            console.log(users)
            users.splice(users.indexOf(data.username), 1)
            console.log('disconnected ', data.username);
            console.log(users);
            onlineCount--;
            // io.emit('left', onlineCount);
        })
        
        socket.on('correct', (word) => {
            io.emit('winner', {winner: data.username, word: word})
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