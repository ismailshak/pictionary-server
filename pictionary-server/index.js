const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const parser = require('body-parser')
const usersRouter = require('./routes/users')

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use('/api/users', usersRouter)

let onlineCount = 0;

let users = [];

io.on('connection', socket => {

    users.push(socket.id)
    onlineCount++;
    io.emit('joined', onlineCount, socket.id)
    console.log('a user connected');
    socket.on('disconnect', deletedSocket => {
        console.log('user ' + socket.id + ' disconnected')
        console.log(socket)
        users.splice(users.indexOf(socket.id), 1)
        onlineCount--;
        // console.log(users)
        io.emit('left', onlineCount);
    })
    // console.log(users)
    // socket.on('play', socket => {
    //     chosenDrawer = users[Math.floor(Math.random()*users.length)]
    //     console.log('chosen drawer ', chosenDrawer)
    //     io.emit('drawer', chosenDrawer);
//  })
    socket.on("drawing", (data) => {
        socket.emit("drawing", data);
    });
});



http.listen(8080, function(){
  console.log('listening on :8080');
});