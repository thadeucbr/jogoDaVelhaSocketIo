const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/../public'));

app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});

io.on('connection', (socket) => {
  let board = ['', '', '', '', '', '', '', '', ''];
  socket.on('move', ({ cellIndex, currentPlayer }) => {
    board[cellIndex] = currentPlayer;
    socket.broadcast.emit('move', { cellIndex, currentPlayer });
  });
  socket.on('reset', () => {
    socket.broadcast.emit('reset')
  })
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
