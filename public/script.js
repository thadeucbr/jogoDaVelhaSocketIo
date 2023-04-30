const socket = io();
const cells = document.querySelectorAll('td');

socket.on('connect', () => {
  console.log('Conectado ao servidor');
});

socket.on('disconnect', () => {
  console.log('Desconectado do servidor');
});

let currentPlayer = 'X';

function handleMove(event) {
  const cell = event.target;
  const cellIndex = Array.from(cells).indexOf(cell);
  if (board[cellIndex] === '') {
    cell.textContent = 'X';
    board[cellIndex] = 'X';
    socket.emit('move', { cellIndex, currentPlayer });
    if (checkWinner()) {
      alert('Ganhou!');
      resetBoard();
      return;
    }
  }
}

const resetButton = document.querySelector('#reset');

const player = 'X';
const playerB = 'O';

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board = ['', '', '', '', '', '', '', '', ''];

function resetBoard() {
  cells.forEach((cell) => {
    cell.textContent = '';
  });
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = player;
}

function checkWinner() {
  for (let i = 0; i < winningCombos.length; i++) {
    const [a, b, c] = winningCombos[i];
    if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
      return true;
    }
  }
  return false;
}

cells.forEach((cell) => {
  cell.addEventListener('click', handleMove);
});

resetButton.addEventListener('click', () => {
  resetBoard()
  socket.emit('reset');
});

socket.on('reset', resetBoard)

socket.on('move', ({ cellIndex, currentPlayer }) => {
  const cell = cells[cellIndex];
  cell.textContent = 'O';
  board[cellIndex] = 'O';
  if (checkWinner()) {
    alert('Perdeu!');
    resetBoard();
    return;
  }
});
