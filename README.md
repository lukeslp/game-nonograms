# Nonograms / Picross

A minimalist browser-based implementation of the classic nonogram (picross) logic puzzle game. Solve logic puzzles by filling grid cells based on number clues to reveal hidden pictures.

## About

Nonograms (also known as Picross, Griddlers, or Paint by Numbers) are picture logic puzzles where you fill in cells on a grid to reveal a hidden image. Numbers on the side and top of the grid indicate how many consecutive cells should be filled in each row or column. These puzzles originated in Japan and have become popular worldwide as an engaging logic challenge.

## Features

- **12 Built-in Puzzles** across four difficulty levels (Easy 5×5, Medium 10×10, Hard 12×12, Expert 15×15)
- **Smooth Drag-to-Paint Interface** for quick cell filling
- **Three Painting Tools**: Fill cells, Mark empty cells, or Clear cells
- **Auto-Marking System** automatically marks remaining cells in solved rows/columns (optional)
- **Real-time Contradiction Detection** highlights errors as you make them
- **Progress Tracking** saves completed puzzles and statistics to localStorage
- **Achievement System** tracks milestones and perfect solves
- **Daily Puzzle Mode** with streak tracking
- **Shuffle Button** to randomize puzzle order
- **Fully Offline** - No server or internet connection required
- **Responsive Design** works on desktop, tablet, and mobile devices
- **Accessibility Features** including ARIA labels and keyboard support

## How to Play

### Getting Started

1. Open `index.html` in a modern web browser (or visit the live version)
2. Select a puzzle from the dropdown menu
3. Choose your painting tool (Fill, Mark Empty, or Clear)
4. Click and drag across cells to paint them with your selected tool
5. Match the number clues for each row and column
6. The puzzle is complete when all cells are correctly filled

### Understanding the Rules

- **Number Clues** indicate groups of consecutive filled cells
- **Multiple Numbers** mean multiple separated groups must appear in that order
- **At Least One Empty Cell** must separate each group
- **Zero Clue** (no numbers) means the entire row/column should be empty
- **Contradictions** glow pink when your filled cells don't match the clues

### Tips for Solving

1. Start with rows/columns that have the most filled cells or largest numbers
2. Look for rows/columns where the numbers add up close to the total length
3. Use the "Mark Empty" tool to track cells you know are empty
4. Enable "Auto-mark solved lines" to automatically fill remaining cells
5. Watch for contradictions - they appear immediately as you paint

## Controls

### Mouse/Touch

- **Click and Drag**: Paint cells with the selected tool
- **Right Click**: Prevented to avoid context menu interference

### Tool Selection

- **Fill Tool**: Mark cells as filled (dark color)
- **Mark Empty Tool**: Mark cells with an "×" to indicate they should be empty
- **Clear Tool**: Remove all marks from cells

### Buttons

- **Puzzle Dropdown**: Select from available puzzles
- **Reset Button**: Clear the current puzzle and start over
- **Shuffle Button**: Load a random puzzle
- **Auto-mark Checkbox**: Toggle automatic marking of solved lines

### Visual Feedback

- **Green Hints**: Row/column is correctly solved
- **Pink Highlights**: Contradictions detected in that row/column
- **Status Line**: Provides contextual feedback and instructions

## Number Clues

- Numbers indicate groups of consecutive filled cells
- Multiple numbers mean multiple separated groups
- Groups must appear in the order shown
- At least one empty cell must separate each group

## Puzzle Difficulty Levels

- **Easy (5×5)**: Heart, Arrow, House - Perfect for beginners
- **Medium (10×10)**: Lantern, Umbrella, Rocket - Increased complexity
- **Hard (12×12)**: Sprout, Butterfly, Sailboat - Requires careful logic
- **Expert (15×15)**: Compass Burst, Owl, Castle - Master-level challenges

## Technical Details

### Architecture

- **Pure Vanilla JavaScript** - No frameworks or dependencies
- **Modern ES6+ Syntax** - Arrow functions, destructuring, template literals
- **CSS Grid Layout** - Responsive puzzle grid system
- **Pointer Events API** - Unified touch and mouse handling
- **localStorage API** - Progress and statistics persistence
- **CSS Variables** - Dynamic theming and grid sizing
- **Document Fragments** - Efficient DOM manipulation
- **ARIA Attributes** - Accessibility support

### Performance Features

- Efficient grid rendering with document fragments
- Minimal DOM manipulation during painting
- CSS-based visual feedback (no JavaScript animation)
- Pointer capture for smooth drag interactions
- Event delegation for grid interactions

## Browser Compatibility

Works in all modern browsers with ES6+ support:

- **Chrome/Edge**: 90+ (tested)
- **Firefox**: 88+ (tested)
- **Safari**: 14+ (tested)
- **Opera**: 76+ (tested)
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+

### Required Browser Features

- ES6 JavaScript (arrow functions, template literals, destructuring)
- CSS Grid and CSS Variables
- Pointer Events API
- localStorage API
- Object.freeze()

## File Structure

```
nonograms/
├── index.html       # Main game page with semantic HTML5
├── app.js           # Game logic and state management (~780 lines)
├── style.css        # Responsive styles with CSS Grid (~312 lines)
├── icon.svg         # Game icon
├── social-card.png  # Social media preview image
└── README.md        # This documentation file
```

## Code Quality

- **Zero Dependencies** - No external libraries or frameworks
- **Modern JavaScript** - ES6+ features throughout
- **JSDoc Comments** - Comprehensive function documentation
- **Semantic HTML** - Proper ARIA roles and labels
- **Mobile-First CSS** - Responsive breakpoints for all devices
- **No Build Step** - Runs directly in browser

## Development

### Local Testing

Simply open `index.html` in a web browser. No server required.

For file:// protocol testing, the code automatically adjusts resource paths.

### Adding New Puzzles

Edit the `rawPuzzles` array in `app.js`:

```javascript
{
    id: "unique-id",
    name: "Puzzle Name",
    difficulty: "easy", // easy, medium, hard, expert
    size: "5×5",
    description: "Brief description",
    lines: [
        "#.#.#",  // # = filled, . = empty
        "#####",
        // ... more rows
    ],
}
```

### Customizing Styles

Edit CSS variables in `style.css`:

```css
:root {
    --bg: #eef2f7;          /* Background color */
    --filled: #1d3557;       /* Filled cell color */
    --contradiction: #ef476f; /* Error highlight color */
    --cell-size: min(52px, 8vw); /* Cell size */
}
```

## Future Enhancements

Potential features for future versions:

- Custom puzzle creator/editor
- Puzzle import/export functionality
- Hint system for stuck players
- Timer and leaderboards
- Color nonograms support
- Puzzle generator algorithm
- Multiplayer mode
- Dark mode toggle

## License

MIT License - see [LICENSE](LICENSE) file

## Author

**Luke Steuber**

- Website: [lukesteuber.com](https://lukesteuber.com)
- GitHub: [@lukeslp](https://github.com/lukeslp)
- Bluesky: [@lukesteuber.com](https://bsky.app/profile/lukesteuber.com)

## Acknowledgments

- Inspired by the classic Japanese logic puzzle (originated in Japan, 1987)
- Uses modern web standards for optimal performance
- Designed with accessibility in mind
