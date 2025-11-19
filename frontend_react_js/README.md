# Tic Tac Toe – React (Ocean Professional Theme)

This project provides a clean, modern, accessible two-player Tic Tac Toe game in React using the "Ocean Professional" blue & amber theme. All logic is in the browser; there are no backend or external calls.

## Features

- **Ocean Professional theme:** blue primary (#2563EB), amber secondary (#F59E0B), light background (#f9fafb)
- **Accessible:** Semantic HTML (`role="grid"`/`gridcell`), ARIA live region, keyboard navigation (Tab, Enter/Space for cell), visible focus
- **Clean state mgmt:** No global state; local hooks and pure functions for winner, draw detection, and state control
- **Robust controls:** "New Game" (soft reset, X starts), "Reset" (hard reset) disable correctly after conclusion
- **Defensive:** Blocks moves after win/draw, disables invalid transitions, error boundary wrapped game
- **Modular:** App.js (root), modular Board and Square components, separated CSS (`tictactoe.css`)
- **Lint- and security-friendly**: No insecure patterns, follows ESLint/Prettier conventions

## File Structure

```
src/
  App.js          # Main app and component composition
  index.js        # Renders App (imports styles)
  tictactoe.css   # Core game and theme styles
  App.css         # Baseline styles
  index.css       # Baseline global styles
```

## Usage

```
npm install
npm start
```
Opens in browser at [http://localhost:3000](http://localhost:3000).

## Controls

- **Play move:** Click cell or Tab to empty ("empty, Cell n"), press Enter/Space
- **New Game:** Soft reset, same X goes first
- **Reset:** Hard reset, clears all history state

## About

Runs entirely in browser with no data persisted or external calls. Modern React and accessible UI practices.

## Learn More

To learn React, visit [React documentation](https://reactjs.org/).
