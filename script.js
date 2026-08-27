// Game state
const gameState = {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    gameOver: false,
    winner: null
};

// Winning combinations
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// DOM elements
const cells = document.querySelectorAll('.cell');
const gameBoard = document.getElementById('game-board');
const currentPlayerDisplay = document.getElementById('current-player');
const gameStatusDisplay = document.getElementById('game-status');
const resetBtn = document.getElementById('reset-btn');

// Initialize game
function initializeGame() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    resetBtn.addEventListener('click', resetGame);
    updateDisplay();
}

// Handle cell click
function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    // Check if cell is already filled or game is over
    if (gameState.board[index] !== null || gameState.gameOver) {
        return;
    }

    // Update game state
    gameState.board[index] = gameState.currentPlayer;
    
    // Update cell display
    cell.textContent = gameState.currentPlayer;
    cell.classList.add(gameState.currentPlayer.toLowerCase());
    cell.classList.add('disabled');

    // Check for winner or draw
    if (checkWinner()) {
        gameState.gameOver = true;
        gameState.winner = gameState.currentPlayer;
        gameStatusDisplay.textContent = `🎉 Player ${gameState.currentPlayer} Wins!`;
        gameStatusDisplay.classList.add('winner');
        disableAllCells();
    } else if (gameState.board.every(cell => cell !== null)) {
        gameState.gameOver = true;
        gameStatusDisplay.textContent = "🤝 It's a Draw!";
        gameStatusDisplay.classList.add('draw');
    } else {
        // Switch player
        gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
        updateDisplay();
    }
}

// Check for winner
function checkWinner() {
    return WINNING_COMBINATIONS.some(combination => {
        const [a, b, c] = combination;
        return gameState.board[a] !== null &&
               gameState.board[a] === gameState.board[b] &&
               gameState.board[a] === gameState.board[c];
    });
}

// Disable all cells
function disableAllCells() {
    cells.forEach(cell => {
        cell.classList.add('disabled');
        cell.style.pointerEvents = 'none';
    });
}

// Update display
function updateDisplay() {
    currentPlayerDisplay.textContent = `Player ${gameState.currentPlayer}'s Turn`;
}

// Reset game
function resetGame() {
    gameState.board = Array(9).fill(null);
    gameState.currentPlayer = 'X';
    gameState.gameOver = false;
    gameState.winner = null;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
        cell.style.pointerEvents = 'auto';
    });

    gameStatusDisplay.textContent = '';
    gameStatusDisplay.classList.remove('winner', 'draw');

    updateDisplay();
}

// Start the game
initializeGame();
