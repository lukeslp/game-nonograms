# Nonograms / Picross

A minimalist browser-based implementation of the classic nonogram (picross) logic puzzle game.

## About

Nonograms are picture logic puzzles where you fill in cells on a grid to reveal a hidden image. Numbers on the side and top of the grid indicate how many consecutive cells should be filled in each row or column.

## Features

- Multiple built-in puzzles of varying difficulty
- Smooth drag-to-paint interface
- Three tools: Fill, Mark Empty, Clear
- Auto-marking of solved rows/columns (optional)
- Contradiction detection and highlighting
- Shuffle button to randomize puzzle order
- Fully playable offline (no server required)

## How to Play

1. Open `index.html` in a modern web browser
2. Select a puzzle from the dropdown menu
3. Choose your tool (Fill, Mark Empty, or Clear)
4. Click and drag across cells to paint
5. Match the number clues for each row and column
6. The puzzle is complete when all cells are correctly filled

## Controls

- **Mouse**: Click and drag to paint cells
- **Tool Buttons**: Switch between Fill, Mark Empty, and Clear modes
- **Reset Button**: Clear the current puzzle and start over
- **Shuffle Button**: Load a random puzzle
- **Auto-mark Checkbox**: Toggle automatic marking of solved lines

## Number Clues

- Numbers indicate groups of consecutive filled cells
- Multiple numbers mean multiple separated groups
- Groups must appear in the order shown
- At least one empty cell must separate each group

## Technical Details

- Pure vanilla JavaScript (no frameworks)
- CSS Grid for puzzle layout
- Responsive design works on desktop and mobile
- No build step required
- All assets self-contained

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## File Structure

```
nonograms/
├── index.html    # Main game page
├── app.js        # Game logic
├── style.css     # Styles
└── README.md     # This file
```

## Credits

Created by Luke Steuber
