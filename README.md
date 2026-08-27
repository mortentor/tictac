# Tic Tac Toe Game

A simple, interactive Tic Tac Toe game built with vanilla HTML, CSS, and JavaScript.

## Features

- **Two-player gameplay**: Player X vs Player O
- **Real-time game status**: Display current player and game results
- **Win detection**: Automatically detects winning combinations
- **Draw detection**: Identifies when the board is full with no winner
- **Reset functionality**: Start a new game at any time
- **Responsive design**: Works on desktop and mobile devices
- **Beautiful UI**: Modern gradient background with smooth animations

## How to Play

1. Open `index.html` in your web browser
2. Players take turns clicking empty cells to place their mark (X or O)
3. First player to get three marks in a row (horizontally, vertically, or diagonally) wins
4. If all cells are filled with no winner, the game is a draw
5. Click "Reset Game" to start a new game

## Game Rules

- Players alternate turns (X always goes first)
- A player cannot click on an already filled cell
- The game ends when:
  - A player gets three in a row
  - All cells are filled (draw)
- No AI opponent (local multiplayer only)

## Files

- `index.html` - Game board structure and layout
- `styles.css` - Styling and responsive design
- `script.js` - Game logic and interactivity
- `README.md` - Documentation

## Winning Combinations

The game checks for these winning patterns:
- Rows: [0,1,2], [3,4,5], [6,7,8]
- Columns: [0,3,6], [1,4,7], [2,5,8]
- Diagonals: [0,4,8], [2,4,6]

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Gradients)
- Vanilla JavaScript (ES6)

## Future Enhancements

- AI opponent (single-player mode)
- Game statistics (wins, losses, draws)
- Difficulty levels
- Multiplayer over network
- Touch-optimized mobile interface
- Undo/Redo functionality
- Sound effects

## License

Free to use and modify for personal or educational purposes.
