import React, { useState, useRef } from "react";
import "./App.css";

// Ocean Professional theme constants
const COLORS = {
  primary: "#2563EB", // Blue
  secondary: "#F59E0B", // Amber
  background: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",
  error: "#EF4444"
};

// PUBLIC_INTERFACE
function App() {
  // State: board cells, player, status, move prevention, history for reset
  const emptyBoard = Array(9).fill(null);
  const [board, setBoard] = useState(emptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winnerInfo, setWinnerInfo] = useState({ winner: null, isDraw: false });
  const [lastResetKey, setLastResetKey] = useState(0); // force hard reset
  const statusBarRef = useRef(null);

  // Compute winner or draw after board update
  React.useEffect(() => {
    const result = calculateWinner(board);
    setWinnerInfo(result);
    if (result.winner || result.isDraw) {
      statusBarRef.current && statusBarRef.current.focus();
    }
  }, [board]);

  // PUBLIC_INTERFACE
  function handleCellClick(index) {
    // Defensive: Block play if finished or cell occupied
    if (board[index] || winnerInfo.winner || winnerInfo.isDraw) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer((p) => (p === "X" ? "O" : "X"));
  }

  // PUBLIC_INTERFACE
  function handleCellKeyDown(e, index) {
    // Accept Space or Enter for accessibility
    if ((e.key === " " || e.key === "Enter") && !board[index] && !winnerInfo.winner && !winnerInfo.isDraw) {
      e.preventDefault();
      handleCellClick(index);
    }
  }

  // PUBLIC_INTERFACE
  function handleNewGame() {
    setBoard(emptyBoard);
    setCurrentPlayer("X");
    setWinnerInfo({ winner: null, isDraw: false });
    // Soft reset: retain current player as "X"
  }

  // PUBLIC_INTERFACE
  function handleHardReset() {
    setBoard(emptyBoard);
    setCurrentPlayer("X");
    setWinnerInfo({ winner: null, isDraw: false });
    setLastResetKey((k) => k + 1); // Change key to force re-render/unfocus
  }

  // Accessibility: Announce game status
  const getStatusMessage = () => {
    if (winnerInfo.winner) {
      return `Winner: ${winnerInfo.winner}`;
    }
    if (winnerInfo.isDraw) {
      return "Draw!";
    }
    return `Current turn: ${currentPlayer}`;
  };

  // Error boundary fallback
  function ErrorFallback({ error }) {
    return (
      <div
        style={{
          background: COLORS.error,
          color: COLORS.surface,
          padding: "1.5rem",
          borderRadius: "1rem",
          maxWidth: 400,
          margin: "2rem auto",
        }}
        tabIndex={-1}
        aria-live="assertive"
        role="alert"
      >
        Oops! An unexpected error occurred.<br />
        <code>{error.message}</code>
      </div>
    );
  }

  // Error boundary
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
      /* You could log error info here */
    }
    render() {
      if (this.state.hasError) {
        return <ErrorFallback error={this.state.error} />;
      }
      return this.props.children;
    }
  }

  // PUBLIC_INTERFACE
  return (
    <div
      className="app-background"
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${COLORS.primary}1A 0%, #e0e7ef 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        color: COLORS.text,
        transition: "all 0.3s",
      }}
    >
      <ErrorBoundary>
        <main>
          <section
            className="game-container"
            tabIndex={-1}
            aria-label="Tic Tac Toe Game"
            style={{
              boxShadow: "0 4px 24px 2px rgba(37,99,235,0.09)",
              background: COLORS.surface,
              borderRadius: 24,
              padding: "2.5rem 2rem 2.25rem 2rem",
              minWidth: 340,
              margin: "0 auto",
              filter: "drop-shadow(0 1px 7px #2563EB22)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1 style={{ textAlign: "center", marginBottom: "1.5rem", fontWeight: 700, fontSize: "2rem", color: COLORS.primary, letterSpacing: "0.01em" }}>Tic Tac Toe</h1>

            <StatusBar
              status={getStatusMessage()}
              ref={statusBarRef}
              winner={winnerInfo.winner}
              isDraw={winnerInfo.isDraw}
              currentPlayer={currentPlayer}
              key={lastResetKey}
              colors={COLORS}
            />

            <Board
              board={board}
              onCellClick={handleCellClick}
              onCellKeyDown={handleCellKeyDown}
              winnerInfo={winnerInfo}
              key={lastResetKey}
              colors={COLORS}
            />

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="btn"
                aria-label="Start a new game"
                onClick={handleNewGame}
                style={{
                  background: COLORS.primary,
                  color: COLORS.surface,
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: "1rem",
                  padding: "0.75em 2.2em",
                  boxShadow: "0 1.5px 3px #2563EB23",
                  cursor: "pointer",
                  transition: "background 0.15s, box-shadow 0.2s",
                  outline: "none"
                }}
              >
                New Game
              </button>
              <button
                className="btn-secondary"
                aria-label="Reset and clear scores"
                onClick={handleHardReset}
                style={{
                  background: COLORS.secondary,
                  color: COLORS.surface,
                  fontWeight: 600,
                  fontSize: "1rem",
                  padding: "0.75em 2.2em",
                  border: "none",
                  borderRadius: 8,
                  boxShadow: "0 1.5px 3px #F59E0B27",
                  marginLeft: 2,
                  cursor: "pointer",
                  outline: "none",
                  transition: "background 0.15s, box-shadow 0.2s",
                }}
              >
                Reset
              </button>
            </div>
            <p style={{ marginTop: "2.4rem", color: "#94A3B8", fontSize: "0.92rem" }}>
              <span role="img" aria-label="wave">🌊</span>{" "}Ocean Professional Theme
            </p>
          </section>
        </main>
      </ErrorBoundary>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board component
 * Props:
 *   - board: Array of 9 cells (X, O, or null)
 *   - onCellClick: fn(idx)
 *   - onCellKeyDown: fn(e, idx)
 *   - winnerInfo: { winner, isDraw }
 *   - colors: theme colors object
 */
function Board({ board, onCellClick, onCellKeyDown, winnerInfo, colors }) {
  // Allow Tab navigation: cells tab-indexed in order if still playable, but not after win/draw.
  return (
    <div
      className="tic-board"
      role="grid"
      aria-label="Tic Tac Toe board"
      aria-readonly={!!(winnerInfo.winner || winnerInfo.isDraw)}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12,
        width: 270,
        height: 270,
        margin: "0 auto",
        background: `linear-gradient(135deg, ${colors.primary}11 0%, ${colors.primary}0A 100%)`,
        borderRadius: 14,
        padding: 8,
        boxShadow: "0 1.5px 8px #2563EB14"
      }}
    >
      {board.map((cell, idx) => (
        <Square
          key={idx}
          value={cell}
          index={idx}
          onClick={() => onCellClick(idx)}
          onKeyDown={(e) => onCellKeyDown(e, idx)}
          disabled={!!cell || !!winnerInfo.winner || !!winnerInfo.isDraw}
          tabIndex={cell || winnerInfo.winner || winnerInfo.isDraw ? -1 : 0}
          isWinning={winnerInfo.winningLine && winnerInfo.winningLine.includes(idx)}
          colors={colors}
        />
      ))}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Square component
 * Props:
 *   - value: "X", "O", or null
 *   - index: int
 *   - onClick: fn
 *   - onKeyDown: fn
 *   - disabled: bool
 *   - tabIndex: number
 *   - isWinning: bool
 *   - colors: theme
 */
function Square({
  value,
  index,
  onClick,
  onKeyDown,
  disabled,
  tabIndex,
  isWinning,
  colors
}) {
  // Keyguides for a11y: show focus & winning highlight
  return (
    <button
      role="gridcell"
      aria-label={value ? `Cell ${index + 1}, ${value}` : `Cell ${index + 1}, empty`}
      aria-disabled={disabled}
      tabIndex={tabIndex}
      disabled={disabled}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className="tic-cell"
      style={{
        width: 78,
        height: 78,
        border: `2.2px solid ${isWinning ? colors.secondary : "#e5e7eb"}`,
        borderRadius: 10,
        background: isWinning
          ? `linear-gradient(140deg, ${colors.secondary}11 60%, ${colors.secondary}50 100%)`
          : colors.surface,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2.25rem",
        fontWeight: 800,
        color:
          value === "X"
            ? colors.primary
            : value === "O"
            ? colors.secondary
            : "#adb5bd",
        boxShadow: isWinning
          ? "0 1.5px 17px #F59E0B26"
          : "0 0.5px 2px #11182707",
        outline: "none",
        transition: "all 0.18s cubic-bezier(.7,.1,.4,1.4)",
        cursor: disabled ? "default" : "pointer",
        position: "relative",
        userSelect: "none"
      }}
      onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px ${colors.primary}44`)}
      onBlur={(e) =>
        (e.target.style.boxShadow = isWinning
          ? "0 1.5px 17px #F59E0B26"
          : "0 0.5px 2px #11182707")
      }
    >
      <span aria-hidden="true">{value}</span>
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * Status bar; uses aria-live to update on board or result changes.
 * Props:
 *   - status: 'Current turn: X', 'Winner: O', 'Draw!', ...
 *   - winner: "X"|"O"|null
 *   - isDraw: bool
 *   - currentPlayer: "X"|"O"
 *   - key: reset key for focus
 *   - colors: theme
 */
const StatusBar = React.forwardRef(({ status, winner, isDraw, currentPlayer, colors }, ref) => (
  <div
    ref={ref}
    className="status-bar"
    aria-live="polite"
    aria-atomic="true"
    tabIndex={-1}
    role="status"
    style={{
      background:
        winner
          ? `linear-gradient(96deg, ${colors.secondary}11, #fff6ec 85%)`
          : isDraw
          ? `linear-gradient(96deg, #dbeafe, #fef3c7 85%)`
          : `linear-gradient(96deg, ${colors.primary}03, #f9fafb 80%)`,
      color:
        winner
          ? colors.secondary
          : isDraw
          ? "#64748b"
          : colors.primary,
      fontWeight: 700,
      marginBottom: "1.3rem",
      borderRadius: 10,
      padding: "0.85rem 1.4rem",
      fontSize: "1.13rem",
      boxShadow: "0 2px 5px #2563EB14",
      outline: 0,
      minHeight: 38,
      letterSpacing: ".01em",
      textAlign: "center",
      transition: "background 0.3s, color 0.2s"
    }}
  >
    {status}
  </div>
));

/**
 * PUBLIC_INTERFACE
 * Checks for winner, draw, and winning line on the board.
 * @param {Array} squares - 9 element array of X/O/null
 * @returns {Object} - {winner: X/O/null, isDraw: bool, winningLine: [idxs]}
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return { winner: squares[a], isDraw: false, winningLine: line };
  }
  // Check draw: no winner and no empty cell
  if (squares.every(Boolean)) return { winner: null, isDraw: true, winningLine: [] };
  return { winner: null, isDraw: false, winningLine: null };
}

/*
App structure:
 - App: Main container, handles game state and game-level controls.
 - StatusBar: Live region for winning, draw, or next player.
 - Board: 3x3 grid, role="grid", keyboard/tab navigation. 
 - Square: Cell button, role="gridcell", aria-label, X/O mark, visual focus and winner state.
Runs entirely local (no backend, no storage); no external dependencies except React. All state is local to App.
*/

// For testability
export { App as default, Board, Square, StatusBar, calculateWinner };
