// Game state
const gameState = {
    board: Array(25).fill(null),
    currentPlayer: 'X',
    gameOver: false,
    winner: null
};

// Board dimensions
const BOARD_SIZE = 5;
const WIN_LENGTH = 3; // Need 3 in a row to win on 5x5 board

// Function to generate all winning combinations for 5x5 board
function generateWinningCombinations() {
    const combinations = [];
    
    // Horizontal lines
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col <= BOARD_SIZE - WIN_LENGTH; col++) {
            const line = [];
            for (let i = 0; i < WIN_LENGTH; i++) {
                line.push(row * BOARD_SIZE + col + i);
            }
            combinations.push(line);
        }
    }
    
    // Vertical lines
    for (let col = 0; col < BOARD_SIZE; col++) {
        for (let row = 0; row <= BOARD_SIZE - WIN_LENGTH; row++) {
            const line = [];
            for (let i = 0; i < WIN_LENGTH; i++) {
                line.push((row + i) * BOARD_SIZE + col);
            }
            combinations.push(line);
        }
    }
    
    // Diagonal lines (top-left to bottom-right)
    for (let row = 0; row <= BOARD_SIZE - WIN_LENGTH; row++) {
        for (let col = 0; col <= BOARD_SIZE - WIN_LENGTH; col++) {
            const line = [];
            for (let i = 0; i < WIN_LENGTH; i++) {
                line.push((row + i) * BOARD_SIZE + col + i);
            }
            combinations.push(line);
        }
    }
    
    // Diagonal lines (top-right to bottom-left)
    for (let row = 0; row <= BOARD_SIZE - WIN_LENGTH; row++) {
        for (let col = WIN_LENGTH - 1; col < BOARD_SIZE; col++) {
            const line = [];
            for (let i = 0; i < WIN_LENGTH; i++) {
                line.push((row + i) * BOARD_SIZE + col - i);
            }
            combinations.push(line);
        }
    }
    
    return combinations;
}

const WINNING_COMBINATIONS = generateWinningCombinations();

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

    // Player X moves
    makeMove(index, 'X');
    
    // Update display and check game state
    if (checkGameState()) {
        return; // Game is over
    }

    // Bot (O) plays after a short delay
    setTimeout(() => {
        const botMove = getBotMove();
        if (botMove !== -1) {
            makeMove(botMove, 'O');
            checkGameState();
        }
    }, 500);
}

// Make a move on the board
function makeMove(index, player) {
    gameState.board[index] = player;
    const cell = cells[index];
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
}

// Check game state after a move
function checkGameState() {
    // Check for winner
    if (checkWinner()) {
        gameState.gameOver = true;
        gameState.winner = gameState.currentPlayer;
        gameStatusDisplay.textContent = `🎉 Player ${gameState.currentPlayer} Wins!`;
        gameStatusDisplay.classList.add('winner');
        disableAllCells();
        return true;
    } 
    // Check if it's a tie (no more winning possibilities)
    else if (isTiedGame()) {
        gameState.gameOver = true;
        gameStatusDisplay.textContent = "🤝 It's a Tie! No more winning moves possible.";
        gameStatusDisplay.classList.add('draw');
        disableAllCells();
        return true;
    } 
    // Check if board is full (draw)
    else if (gameState.board.every(cell => cell !== null)) {
        gameState.gameOver = true;
        gameStatusDisplay.textContent = "🤝 It's a Draw!";
        gameStatusDisplay.classList.add('draw');
        disableAllCells();
        return true;
    } 
    else {
        // Switch player
        gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
        if (gameState.currentPlayer === 'X') {
            updateDisplay();
        }
        return false;
    }
}

// Check for winner
function checkWinner() {
    return WINNING_COMBINATIONS.some(combination => {
        const [first, ...rest] = combination;
        const firstPlayer = gameState.board[first];
        
        return firstPlayer !== null && rest.every(index => gameState.board[index] === firstPlayer);
    });
}

// Check if the game is tied (no player can possibly win)
function isTiedGame() {
    // For each winning combination, check if either player can still complete it
    for (let combination of WINNING_COMBINATIONS) {
        const cells = combination.map(index => gameState.board[index]);
        
        // Count X's, O's, and empty cells in this line
        const xCells = cells.filter(cell => cell === 'X').length;
        const oCells = cells.filter(cell => cell === 'O').length;
        const emptyCells = cells.filter(cell => cell === null).length;
        
        // If a line has both X and O, it's blocked
        if (xCells > 0 && oCells > 0) {
            continue; // This line is blocked, check next
        }
        
        // If a line has empty cells and only one player's marks, they can still win
        if (emptyCells > 0) {
            return false; // At least one player can still potentially win
        }
    }
    
    // If we get here, no player can win
    return true;
}

// Bot AI - Always wins or forces a draw
function getBotMove() {
    // 1. If bot can win, win immediately
    for (let i = 0; i < gameState.board.length; i++) {
        if (gameState.board[i] === null) {
            gameState.board[i] = 'O';
            if (checkWinnerForPlayer('O')) {
                gameState.board[i] = null; // Undo
                return i;
            }
            gameState.board[i] = null; // Undo
        }
    }
    
    // 2. Block player X from winning
    for (let i = 0; i < gameState.board.length; i++) {
        if (gameState.board[i] === null) {
            gameState.board[i] = 'X';
            if (checkWinnerForPlayer('X')) {
                gameState.board[i] = null; // Undo
                return i; // Block this position
            }
            gameState.board[i] = null; // Undo
        }
    }
    
    // 3. Play strategically to build winning opportunities
    let bestScore = -Infinity;
    let bestMove = -1;
    
    for (let i = 0; i < gameState.board.length; i++) {
        if (gameState.board[i] === null) {
            const score = evaluatePosition(i);
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    
    return bestMove !== -1 ? bestMove : findAnyMove();
}

// Check if a specific player has won
function checkWinnerForPlayer(player) {
    return WINNING_COMBINATIONS.some(combination => {
        const [first, ...rest] = combination;
        return gameState.board[first] === player && rest.every(index => gameState.board[index] === player);
    });
}

// Evaluate a position score for strategic play
function evaluatePosition(index) {
    let score = 0;
    
    // Center positions are more valuable
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    const distFromCenter = Math.abs(row - 2) + Math.abs(col - 2);
    score += (4 - distFromCenter) * 2;
    
    // Count potential winning lines through this position
    for (let combination of WINNING_COMBINATIONS) {
        if (!combination.includes(index)) continue;
        
        const cells = combination.map(i => gameState.board[i]);
        const oCells = cells.filter(c => c === 'O').length;
        const xCells = cells.filter(c => c === 'X').length;
        const emptyCells = cells.filter(c => c === null).length;
        
        // Bonus for positions that help O build lines
        if (xCells === 0 && emptyCells > 0) {
            score += oCells * 10; // Prefer positions that build O's advantage
        }
        
        // Penalty for positions that help X build lines
        if (oCells === 0 && emptyCells > 0) {
            score += (WIN_LENGTH - xCells) * 5; // Still valuable to block X
        }
    }
    
    return score;
}

// Find any available move
function findAnyMove() {
    for (let i = 0; i < gameState.board.length; i++) {
        if (gameState.board[i] === null) {
            return i;
        }
    }
    return -1;
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
    currentPlayerDisplay.textContent = `Your Turn (You are X)`;
}

// Reset game
function resetGame() {
    gameState.board = Array(25).fill(null);
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
