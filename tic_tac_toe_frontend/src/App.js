import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Minimalistic, modern Tic Tac Toe game with responsive design and light theme.
 * Features:
 * - Two players on the same device
 * - Current turn display, winner/draw detection
 * - Restart button
 * - Responsive layout
 * - Themed using: Accent #ffea00, Primary #1976d2, Secondary #424242
 */

/** Color palette (used in App.css):
    --primary: #1976d2;
    --secondary: #424242;
    --accent: #ffea00;
*/

/* Helper function to calculate winner */
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /**
   * Determines the winner of the tic tac toe game.
   * @param {Array} squares - Array of 9 values ('X', 'O', or null)
   * @returns {'X'|'O'|null} Winner or null if no winner
   */
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  /**
   * Renders an individual square for the game board.
   * @param {string|null} value - 'X', 'O', or null
   * @param {function} onClick - Click handler
   * @param {boolean} highlight - If true, highlights this square (part of winning line)
   */
  return (
    <button
      className={`ttt-square${highlight ? " winner" : ""}`}
      onClick={onClick}
      aria-label={value ? `Square with ${value}` : "Empty square"}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine }) {
  /**
   * Renders the 3x3 tic tac toe board.
   * @param {Array} squares - Array of 9 values ('X', 'O', or null)
   * @param {function} onSquareClick - Called with (i) when square is clicked
   * @param {Array} winningLine - Indices in the winning line (to highlight)
   */
  function renderSquare(i) {
    const highlight = winningLine && winningLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={highlight}
      />
    );
  }
  return (
    <div className="ttt-board">
      {[0, 1, 2].map((row) => (
        <div key={row} className="ttt-board-row">
          {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Game state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState("");
  const [winningLine, setWinningLine] = useState(null);

  // Light theme enforced; palette managed in CSS
  useEffect(() => {
    document.body.setAttribute("data-theme", "light");
  }, []);

  useEffect(() => {
    const winnerInfo = getWinnerInfo(squares);
    if (winnerInfo.winner) {
      setStatus(`Winner: ${winnerInfo.winner}`);
      setWinningLine(winnerInfo.line);
    } else if (squares.every(Boolean)) {
      setStatus("Draw! Cat's game.");
      setWinningLine(null);
    } else {
      setStatus(`Next turn: ${xIsNext ? "X" : "O"}`);
      setWinningLine(null);
    }
  }, [squares, xIsNext]);

  // PUBLIC_INTERFACE
  function handleClick(i) {
    if (squares[i] || getWinnerInfo(squares).winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setStatus("Next turn: X");
    setWinningLine(null);
  }

  return (
    <div className="ttt-root">
      <main className="ttt-main">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status" aria-live="polite">
          {status}
        </div>
        <Board
          squares={squares}
          onSquareClick={handleClick}
          winningLine={winningLine}
        />
        <button
          type="button"
          className="ttt-restart-btn"
          onClick={restartGame}
        >
          Restart
        </button>
        <footer className="ttt-footer">
          <span>
            <span className="accent">X</span> Player: {xIsNext ? "Your turn" : "Wait"}
            {" | "}
            <span className="accent">O</span> Player: {xIsNext ? "Wait" : "Your turn"}
          </span>
        </footer>
      </main>
    </div>
  );
}

/**
 * Returns winning line and winner symbol if won, else both null.
 * @param {Array} squares
 * @returns { winner: string|null, line: Array|null }
 */
function getWinnerInfo(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}

export default App;
