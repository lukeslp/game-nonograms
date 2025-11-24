# Nonograms / Picross Enhancement Suggestions

Generated: 2025-11-20

## Project Overview

This is a minimalist browser-based nonogram (picross) puzzle game featuring 3 built-in puzzles (10x10, 12x12, 15x15), smooth drag-to-paint mechanics, contradiction detection, and auto-marking of solved lines. The game is built with vanilla JavaScript, requires no build process, and works entirely offline.

**Current Strengths:**
- Clean, accessible implementation with semantic HTML and ARIA labels
- Smooth pointer-based interaction supporting mouse, touch, and pen input
- Real-time contradiction detection with visual feedback
- Responsive design that adapts to mobile devices
- Zero dependencies and offline-capable

**Current Limitations:**
- Only 3 puzzles with no way to add more without editing code
- No save/resume functionality
- No progression system or difficulty curve
- Limited hint/help system beyond auto-marking
- No achievement or engagement mechanics
- No undo/redo functionality

---

## Quick Wins (Low-Hanging Fruit)

### 1. LocalStorage Save State
**Effort: Low | Impact: High | Priority: High**

Implement automatic save/resume using `localStorage` so players don't lose progress when closing the browser.

**Implementation:**
```javascript
// Save state after each move
function savePuzzleState() {
    const state = {
        puzzleId: state.puzzle.id,
        board: state.board,
        timestamp: Date.now()
    };
    localStorage.setItem('nonogram_current', JSON.stringify(state));
}

// Restore on load
function restorePuzzleState() {
    const saved = localStorage.getItem('nonogram_current');
    if (saved) {
        const { puzzleId, board, timestamp } = JSON.parse(saved);
        loadPuzzle(puzzleId);
        state.board = board;
        state.board.forEach((row, r) => {
            row.forEach((cell, c) => syncCell(r, c));
        });
        evaluateBoard();
    }
}
```

**Resources:**
- [Gamedev.js: Using localStorage for game progress](https://gamedevjs.com/articles/using-local-storage-for-high-scores-and-game-progress/)
- [W3C Web Storage API](https://www.w3.org/TR/webstorage/)

---

### 2. Undo/Redo System
**Effort: Low | Impact: High | Priority: High**

Add undo/redo buttons with keyboard shortcuts (Ctrl+Z / Ctrl+Y). This is consistently rated as a must-have feature in puzzle games.

**Implementation:**
```javascript
const history = {
    past: [],
    future: []
};

function recordMove(row, col, oldState, newState) {
    history.past.push({ row, col, oldState, newState });
    history.future = []; // Clear redo stack on new move
    if (history.past.length > 100) history.past.shift(); // Limit memory
}

function undo() {
    if (history.past.length === 0) return;
    const move = history.past.pop();
    history.future.push(move);
    updateCell(move.row, move.col, move.oldState);
    evaluateBoard();
}

function redo() {
    if (history.future.length === 0) return;
    const move = history.future.pop();
    history.past.push(move);
    updateCell(move.row, move.col, move.newState);
    evaluateBoard();
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') undo();
    if (e.ctrlKey && e.key === 'y') redo();
});
```

**UI Addition:**
```html
<div class="control-buttons">
    <button type="button" id="undo" disabled>Undo</button>
    <button type="button" id="redo" disabled>Redo</button>
    <button type="button" id="resetPuzzle">Reset</button>
    <button type="button" id="newShuffled">Shuffle</button>
</div>
```

---

### 3. Puzzle Completion Tracking
**Effort: Low | Impact: Medium | Priority: High**

Show which puzzles have been completed with visual indicators and completion times.

**Implementation:**
```javascript
function trackCompletion() {
    const completions = JSON.parse(localStorage.getItem('nonogram_completions') || '{}');
    return {
        markComplete: (puzzleId) => {
            completions[puzzleId] = {
                completed: true,
                timestamp: Date.now(),
                attempts: (completions[puzzleId]?.attempts || 0) + 1
            };
            localStorage.setItem('nonogram_completions', JSON.stringify(completions));
        },
        isComplete: (puzzleId) => completions[puzzleId]?.completed || false,
        getStats: (puzzleId) => completions[puzzleId] || null
    };
}

// Update puzzle picker with completion indicators
function populatePuzzlePicker() {
    const tracker = trackCompletion();
    state.puzzles.forEach((puzzle) => {
        const option = document.createElement("option");
        option.value = puzzle.id;
        const checkmark = tracker.isComplete(puzzle.id) ? '✓ ' : '';
        option.textContent = checkmark + puzzle.name;
        frag.appendChild(option);
    });
}
```

---

### 4. Timer Display (Optional)
**Effort: Low | Impact: Low | Priority: Medium**

Add an optional timer to track solve time for competitive players. Make it toggleable since some players find timers stressful.

**Implementation:**
```javascript
let startTime = null;
let timerInterval = null;
let showTimer = localStorage.getItem('nonogram_show_timer') !== 'false';

function startTimer() {
    if (!showTimer) return;
    startTime = Date.now();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

---

### 5. Keyboard Shortcuts
**Effort: Low | Impact: Medium | Priority: Medium**

Add keyboard shortcuts for common actions to improve accessibility and speed.

**Shortcuts:**
- `1` or `F` - Fill tool
- `2` or `X` - Mark empty tool
- `3` or `C` - Clear tool
- `R` - Reset puzzle
- `Space` - Shuffle to new puzzle
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `?` - Show help dialog

**Implementation:**
```javascript
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'SELECT') return; // Don't interfere with dropdowns

    switch(e.key.toLowerCase()) {
        case '1':
        case 'f':
            setTool('fill');
            break;
        case '2':
        case 'x':
            setTool('mark');
            break;
        case '3':
        case 'c':
            setTool('clear');
            break;
        case 'r':
            if (!e.ctrlKey) resetBoard();
            break;
        case ' ':
            e.preventDefault();
            shufflePuzzle();
            break;
        case '?':
            showHelpDialog();
            break;
    }
});
```

---

## High-Value Enhancements

### 6. Puzzle Library with Categories
**Effort: Medium | Impact: High | Priority: High**

Organize puzzles by difficulty and theme. Create a more extensive library with 20-30 puzzles across multiple difficulty levels.

**Puzzle Structure:**
```javascript
const puzzleLibrary = {
    beginner: [
        { id: "heart5x5", name: "Heart", size: "5×5", lines: [...] },
        { id: "star5x5", name: "Star", size: "5×5", lines: [...] },
        { id: "house7x7", name: "House", size: "7×7", lines: [...] }
    ],
    easy: [
        { id: "lantern", name: "Lantern", size: "10×10", lines: [...] },
        { id: "tree10x10", name: "Tree", size: "10×10", lines: [...] }
    ],
    medium: [
        { id: "sprout", name: "Sprout", size: "12×12", lines: [...] },
        { id: "flower12x12", name: "Flower", size: "12×12", lines: [...] }
    ],
    hard: [
        { id: "compass", name: "Compass Burst", size: "15×15", lines: [...] },
        { id: "dragon15x15", name: "Dragon", size: "15×15", lines: [...] }
    ],
    expert: [
        { id: "castle20x20", name: "Castle", size: "20×20", lines: [...] },
        { id: "portrait25x25", name: "Portrait", size: "25×25", lines: [...] }
    ]
};
```

**UI Enhancement:**
```html
<div class="puzzle-selector">
    <div class="difficulty-tabs">
        <button class="tab active" data-difficulty="beginner">Beginner</button>
        <button class="tab" data-difficulty="easy">Easy</button>
        <button class="tab" data-difficulty="medium">Medium</button>
        <button class="tab" data-difficulty="hard">Hard</button>
        <button class="tab" data-difficulty="expert">Expert</button>
    </div>
    <div class="puzzle-grid">
        <!-- Thumbnail previews of puzzles -->
    </div>
</div>
```

**Research Insight:**
According to puzzle game design research, optimal difficulty progression requires "just challenging enough" puzzles - too easy causes boredom, too hard causes frustration. Offer 5-7 puzzles per difficulty tier with gradual increases in complexity.

**Resources:**
- [Medium: Level Progression and Pacing in Puzzle Games](https://medium.com/@mdelally/level-progression-and-pacing-in-puzzle-games-eb9e6a97e571)
- [Game Developer: The Player's Progress](https://www.gamedeveloper.com/design/the-player-s-progress-designing-levels-for-mobile-puzzle-games)

---

### 7. Smart Hint System
**Effort: High | Impact: High | Priority: Medium**

Implement a human-like hint system that reveals one logical deduction at a time, not just arbitrary cell fills.

**Algorithm Approach:**
The Griddlers Solver approach uses logical solving techniques that work like humans do, providing hints that are always logical steps discoverable from the current state. Research shows that nonogram solving algorithms typically iterate through lines applying logical rules, only guessing when stuck.

**Implementation Levels:**

**Level 1: Show Solvable Lines**
Highlight rows/columns that can be partially or fully solved using logic.

```javascript
function findSolvableLines() {
    const solvable = { rows: [], cols: [] };

    // Check each row
    state.puzzle.rowHints.forEach((hints, rowIdx) => {
        const cells = state.board[rowIdx];
        const possibilities = generateLinePossibilities(cells, hints);
        const certainCells = findCertainCells(possibilities);
        if (certainCells.length > 0) {
            solvable.rows.push({ index: rowIdx, cells: certainCells });
        }
    });

    // Check each column
    state.puzzle.columnHints.forEach((hints, colIdx) => {
        const cells = state.board.map(row => row[colIdx]);
        const possibilities = generateLinePossibilities(cells, hints);
        const certainCells = findCertainCells(possibilities);
        if (certainCells.length > 0) {
            solvable.cols.push({ index: colIdx, cells: certainCells });
        }
    });

    return solvable;
}
```

**Level 2: Reveal One Cell**
Show a single cell that can be logically deduced.

```javascript
function giveHint() {
    const solvable = findSolvableLines();

    if (solvable.rows.length > 0) {
        const line = solvable.rows[0];
        const cell = line.cells[0];
        // Highlight this cell as a hint
        flashHint(line.index, cell.col, cell.state);
        return;
    }

    if (solvable.cols.length > 0) {
        const line = solvable.cols[0];
        const cell = line.cells[0];
        flashHint(cell.row, line.index, cell.state);
        return;
    }

    // No logical hints available - puzzle may require guessing
    showMessage("No obvious moves available. Try filling in logical certainties first.");
}
```

**Level 3: Show Solving Technique**
Explain WHY a cell should be filled, teaching players solving strategies.

```javascript
const hintExplanations = {
    simple_block: "This row needs a block of {n} cells, and there's only one place it fits.",
    edge_extension: "This filled cell must be part of the {n}-block, so extend it.",
    overlap: "The {n}-block overlaps in these positions regardless of where it starts.",
    complete_line: "This row is complete - mark remaining cells as empty.",
    forced_gap: "Blocks must be separated by at least one empty cell."
};
```

**Resources:**
- [Griddlers Solver with Animations](https://jsimlo.sk/griddlers/) - Shows logical solving steps
- [Towards Data Science: Solving Nonograms with 120 Lines of Code](https://towardsdatascience.com/solving-nonograms-with-120-lines-of-code-a7c6e0f627e4/)
- [Rosetta Code: Nonogram Solver](https://rosettacode.org/wiki/Nonogram_solver)

---

### 8. Visual Grid Enhancements
**Effort: Low | Impact: Medium | Priority: Medium**

Add quality-of-life visual improvements common in polished nonogram games.

**Enhancements:**
1. **Row/Column Highlighting**: Highlight the current row and column being hovered over
2. **Number Strikethrough**: Cross out hint numbers as they're satisfied
3. **Zoom Controls**: For larger puzzles (20x20+)
4. **Color Themes**: Light/dark mode and alternative color schemes
5. **Animations**: Smooth cell fill transitions and celebration animations on solve

```css
/* Row/column highlighting */
.grid:hover .cell[data-row="3"] {
    outline: 2px solid var(--accent);
    outline-offset: -1px;
}

/* Number strikethrough */
.hint-line.complete span {
    text-decoration: line-through;
    opacity: 0.5;
}

/* Cell fill animation */
.cell.filled {
    animation: fillCell 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes fillCell {
    from { transform: scale(0.8); }
    to { transform: scale(1); }
}

/* Celebration on puzzle complete */
@keyframes celebrate {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
```

---

### 9. Touch/Mobile Optimizations
**Effort: Medium | Impact: High | Priority: High**

Improve mobile experience with better touch controls and gestures.

**Enhancements:**
1. **Long-press to switch tools**: Hold to mark empty instead of filling
2. **Two-finger pan/zoom**: For large puzzles on small screens
3. **Haptic feedback**: Vibration on tool switch and contradiction
4. **Larger tap targets**: Increase cell minimum size on mobile
5. **Tool palette button**: Single large button that cycles through tools

```javascript
let longPressTimer = null;
let longPressStartTool = null;

function handlePointerDown(event) {
    // ... existing code ...

    // Set up long-press detection
    longPressStartTool = state.tool;
    longPressTimer = setTimeout(() => {
        // Switch to mark tool on long press
        if (state.tool === 'fill') {
            setTool('mark');
            if (navigator.vibrate) navigator.vibrate(50);
        }
    }, 500);
}

function handlePointerUp(event) {
    // ... existing code ...

    // Cancel long press
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }

    // Restore original tool if it was temporarily switched
    if (longPressStartTool && longPressStartTool !== state.tool) {
        setTool(longPressStartTool);
    }
}

// Add haptic feedback on contradiction
function highlightGridConflicts(rowStatuses, columnStatuses) {
    const hasContradictions = rowStatuses.some(s => s.contradiction) ||
                             columnStatuses.some(s => s.contradiction);

    if (hasContradictions && navigator.vibrate) {
        navigator.vibrate([50, 100, 50]); // Short-long-short pattern
    }

    // ... existing code ...
}
```

---

### 10. Achievement System
**Effort: Medium | Impact: Medium | Priority: Low**

Add achievements to increase engagement and provide secondary goals.

**Achievement Categories:**
```javascript
const achievements = {
    // Completion achievements
    first_solve: {
        name: "First Steps",
        description: "Complete your first puzzle",
        icon: "🎉"
    },
    complete_difficulty: {
        name: "Master of {difficulty}",
        description: "Complete all {difficulty} puzzles",
        icon: "⭐"
    },
    complete_all: {
        name: "Puzzle Master",
        description: "Complete every puzzle",
        icon: "👑"
    },

    // Speed achievements
    speed_demon: {
        name: "Speed Demon",
        description: "Complete a puzzle in under 2 minutes",
        icon: "⚡"
    },

    // Skill achievements
    no_mistakes: {
        name: "Perfect Logic",
        description: "Complete a puzzle without any contradictions",
        icon: "🧠"
    },
    no_hints: {
        name: "Purist",
        description: "Complete a puzzle without using hints",
        icon: "💪"
    },

    // Streak achievements
    daily_solver: {
        name: "Daily Solver",
        description: "Complete at least one puzzle 7 days in a row",
        icon: "📅"
    }
};
```

**Implementation:**
```javascript
function checkAchievements() {
    const stats = loadPlayerStats();
    const newAchievements = [];

    // Check each achievement condition
    if (stats.puzzlesCompleted === 1 && !stats.achievements.includes('first_solve')) {
        unlockAchievement('first_solve');
        newAchievements.push('first_solve');
    }

    // ... check other achievements ...

    // Show toast notifications for new achievements
    newAchievements.forEach(showAchievementToast);
}

function showAchievementToast(achievementId) {
    const achievement = achievements[achievementId];
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-text">
            <strong>Achievement Unlocked!</strong>
            <p>${achievement.name}</p>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}
```

---

## Stretch Goals

### 11. Puzzle Generator from Images
**Effort: Very High | Impact: High | Priority: Low**

Allow users to upload images and generate playable nonogram puzzles automatically.

**Algorithm Steps:**
1. **Image preprocessing**: Resize to target dimensions (10x10, 15x15, etc.)
2. **Binarization**: Convert to black/white using threshold
3. **Hint generation**: Calculate row and column hints
4. **Solvability check**: Verify puzzle is logically solvable
5. **Solution uniqueness** (optional): Ensure puzzle has only one solution

**Implementation Approach:**
```javascript
function generatePuzzleFromImage(imageData, targetSize) {
    // 1. Resize image to target grid size
    const resized = resizeImage(imageData, targetSize, targetSize);

    // 2. Convert to grayscale
    const grayscale = toGrayscale(resized);

    // 3. Apply threshold to create binary image
    const threshold = calculateOtsuThreshold(grayscale);
    const binary = grayscale.map(pixel => pixel < threshold ? 1 : 0);

    // 4. Generate hints
    const grid = arrayToGrid(binary, targetSize);
    const puzzle = {
        width: targetSize,
        height: targetSize,
        grid: grid,
        rowHints: grid.map(row => computeHintLine(row)),
        columnHints: Array.from({ length: targetSize }, (_, colIdx) =>
            computeHintLine(grid.map(row => row[colIdx]))
        )
    };

    // 5. Verify solvability
    if (isPuzzleSolvable(puzzle)) {
        return puzzle;
    } else {
        // Adjust threshold and try again
        return null; // Or retry with different parameters
    }
}

function isPuzzleSolvable(puzzle) {
    // Implement line-solving algorithm
    // Return true if puzzle can be solved using logical deduction
    const solver = new NonogramSolver(puzzle);
    return solver.canSolveLogically();
}
```

**UI Component:**
```html
<div class="puzzle-creator">
    <h3>Create Custom Puzzle</h3>
    <input type="file" id="imageUpload" accept="image/*">
    <label>
        Puzzle Size:
        <select id="puzzleSize">
            <option value="10">10×10</option>
            <option value="15">15×15</option>
            <option value="20">20×20</option>
            <option value="25">25×25</option>
        </select>
    </label>
    <button id="generatePuzzle">Generate Puzzle</button>
    <canvas id="previewCanvas"></canvas>
</div>
```

**Resources:**
- [MATLAB Nonogram Creator](https://www.mathworks.com/matlabcentral/fileexchange/81968-nonogram-puzzle-creator-based-on-input-images)
- [GitHub: Nonogram-Maker](https://github.com/kniffen/Nonogram-Maker)
- [ScienceDirect: Automated generation of picture-logic puzzles](https://www.sciencedirect.com/science/article/abs/pii/S009784930700163X)

---

### 12. Daily Challenge Mode
**Effort: Medium | Impact: Medium | Priority: Low**

Offer a new puzzle each day with leaderboards and sharing.

**Implementation:**
```javascript
function getDailyPuzzle() {
    // Use date as seed for deterministic random puzzle selection
    const today = new Date().toISOString().split('T')[0];
    const seed = hashCode(today);
    const puzzleIndex = seed % state.puzzles.length;
    return state.puzzles[puzzleIndex];
}

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}
```

**Sharing Feature:**
```javascript
function shareScore(time, mistakes) {
    const today = new Date().toISOString().split('T')[0];
    const emoji = mistakes === 0 ? '🟩' : mistakes < 3 ? '🟨' : '🟥';
    const shareText = `Nonogram ${today}\n${emoji} ${formatTime(time)}\n${mistakes} mistakes\n\n${window.location.href}`;

    if (navigator.share) {
        navigator.share({ text: shareText });
    } else {
        navigator.clipboard.writeText(shareText);
        showToast('Score copied to clipboard!');
    }
}
```

---

### 13. Multiplayer / Cooperative Mode
**Effort: Very High | Impact: Medium | Priority: Low**

Allow multiple players to solve the same puzzle simultaneously.

**Approaches:**
1. **Local multiplayer**: Split-screen with different colored cursors
2. **Online multiplayer**: Real-time WebSocket synchronization
3. **Asynchronous cooperative**: Players take turns via shared link

**Simpler Implementation (Local Multiplayer):**
```javascript
const players = [
    { id: 1, name: 'Player 1', color: '#118ab2', tool: 'fill' },
    { id: 2, name: 'Player 2', color: '#ef476f', tool: 'fill' }
];

let activePlayer = 0;

function handlePointerDown(event) {
    const player = players[activePlayer];
    // ... existing code, but track which player made the move ...

    // Switch players
    activePlayer = (activePlayer + 1) % players.length;
    updatePlayerIndicator();
}
```

---

### 14. Color Nonograms
**Effort: Very High | Impact: High | Priority: Low**

Support multi-color puzzles (much more complex than black and white).

**Color Puzzle Structure:**
```javascript
const colorPuzzle = {
    id: "rainbow_flower",
    name: "Rainbow Flower (12×12)",
    colors: ['red', 'orange', 'yellow', 'green', 'blue'],
    lines: [
        "..RRYY......", // Each cell can be a specific color
        ".RRRYYYY....",
        "RRRRYYYYGG..",
        // ...
    ],
    rowHints: [
        [{ color: 'red', count: 2 }, { color: 'yellow', count: 2 }],
        [{ color: 'red', count: 3 }, { color: 'yellow', count: 4 }],
        // ...
    ],
    columnHints: [
        // Similar structure...
    ]
};
```

**Challenges:**
- Much more complex solving logic
- Color picker UI for mobile
- Accessibility concerns (colorblind mode essential)
- Significantly harder to solve

**Research Insight:**
Color nonograms require more sophisticated algorithms including genetic algorithms for color reduction and quantification. Start with 2-3 colors max before expanding.

---

### 15. Puzzle Editor
**Effort: High | Impact: Medium | Priority: Low**

Let users create puzzles manually by clicking cells, then test and share them.

**Editor UI:**
```html
<div class="puzzle-editor">
    <h3>Puzzle Editor</h3>
    <div class="editor-grid" id="editorGrid">
        <!-- Editable grid where users click to fill/clear cells -->
    </div>
    <div class="editor-controls">
        <button id="clearEditor">Clear</button>
        <button id="testPuzzle">Test Puzzle</button>
        <button id="savePuzzle">Save</button>
        <button id="exportPuzzle">Export to JSON</button>
    </div>
    <div class="puzzle-metadata">
        <input type="text" id="puzzleName" placeholder="Puzzle Name">
        <textarea id="puzzleDescription" placeholder="Description"></textarea>
    </div>
</div>
```

**Implementation:**
```javascript
function enableEditorMode() {
    const editorState = {
        grid: Array(15).fill(null).map(() => Array(15).fill(false)),
        width: 15,
        height: 15
    };

    // Build editable grid
    const editorGrid = document.getElementById('editorGrid');
    editorGrid.addEventListener('click', (e) => {
        const cell = e.target.closest('.editor-cell');
        if (!cell) return;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        editorState.grid[row][col] = !editorState.grid[row][col];
        cell.classList.toggle('filled');
        updateEditorHints();
    });
}

function exportPuzzle(editorState) {
    const puzzle = {
        id: generatePuzzleId(),
        name: document.getElementById('puzzleName').value,
        description: document.getElementById('puzzleDescription').value,
        lines: editorState.grid.map(row =>
            row.map(cell => cell ? '#' : '.').join('')
        )
    };

    // Copy to clipboard as JSON
    const json = JSON.stringify(puzzle, null, 2);
    navigator.clipboard.writeText(json);
    showToast('Puzzle copied to clipboard!');
}
```

---

## Tools & Libraries to Consider

### 1. Canvas-based Rendering (for large puzzles)
**Use Case:** Improve performance for 20x20+ puzzles

Current implementation uses DOM elements (one `<div>` per cell). For larger puzzles, canvas rendering would be much faster.

**Library:** None needed - use native HTML5 Canvas API

**Example:**
```javascript
function renderGridToCanvas(ctx, width, height) {
    const cellSize = 20;

    ctx.clearRect(0, 0, width * cellSize, height * cellSize);

    state.board.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell === CellState.FILLED) {
                ctx.fillStyle = '#1d3557';
                ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
            } else if (cell === CellState.MARKED) {
                ctx.strokeStyle = '#a0aec0';
                ctx.beginPath();
                ctx.moveTo(c * cellSize, r * cellSize);
                ctx.lineTo((c + 1) * cellSize, (r + 1) * cellSize);
                ctx.moveTo((c + 1) * cellSize, r * cellSize);
                ctx.lineTo(c * cellSize, (r + 1) * cellSize);
                ctx.stroke();
            }
        });
    });
}
```

---

### 2. Lodash/Ramda (for functional utilities)
**Use Case:** Cleaner array manipulation and memoization

**Alternative:** Keep vanilla JS - current codebase is clean and dependency-free. Only add if implementing complex solver algorithms.

---

### 3. Web Workers (for puzzle solving)
**Use Case:** Run hint/solver algorithms in background thread

If implementing the smart hint system (suggestion #7), offload the solving algorithm to a Web Worker so it doesn't freeze the UI.

**Example:**
```javascript
// solver.worker.js
self.addEventListener('message', (e) => {
    const { puzzle, board } = e.data;
    const hint = findNextLogicalMove(puzzle, board);
    self.postMessage(hint);
});

// main.js
const solverWorker = new Worker('solver.worker.js');
solverWorker.addEventListener('message', (e) => {
    const hint = e.data;
    displayHint(hint);
});

function requestHint() {
    solverWorker.postMessage({
        puzzle: state.puzzle,
        board: state.board
    });
}
```

**Resources:**
- [MDN Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

---

### 4. IndexedDB (for large puzzle collections)
**Use Case:** Store 100+ puzzles locally without hitting localStorage limits

localStorage has 5-10MB limit. If adding a large puzzle library (100+ puzzles), use IndexedDB instead.

**Library:** [idb](https://github.com/jakearchibald/idb) - Promise-based IndexedDB wrapper (3KB)

**Example:**
```javascript
import { openDB } from 'idb';

const db = await openDB('nonogram-db', 1, {
    upgrade(db) {
        db.createObjectStore('puzzles', { keyPath: 'id' });
        db.createObjectStore('progress', { keyPath: 'puzzleId' });
    }
});

// Save puzzle
await db.put('puzzles', puzzle);

// Load all puzzles
const allPuzzles = await db.getAll('puzzles');
```

---

### 5. Vite or Parcel (build tool)
**Use Case:** Only if adding TypeScript, modules, or bundling

Current setup is intentionally simple with no build step. Only add a bundler if:
- Converting to TypeScript
- Splitting code into modules
- Adding npm dependencies
- Implementing hot module reloading for development

**Recommendation:** Keep it simple unless project grows significantly. Zero-build-step is a feature, not a limitation.

---

## Architecture & Infrastructure

### 1. Code Organization
**Current:** Single 485-line `app.js` file

**Recommendation:** Split into modules when adding more features:

```
nonograms/
├── index.html
├── style.css
├── src/
│   ├── main.js          # Entry point, initialization
│   ├── puzzle.js        # Puzzle data and loading
│   ├── game-state.js    # Board state management
│   ├── ui.js            # DOM manipulation and rendering
│   ├── controls.js      # Input handling (pointer, keyboard)
│   ├── solver.js        # Hint system and validation
│   ├── storage.js       # LocalStorage/IndexedDB wrapper
│   └── achievements.js  # Achievement tracking
└── README.md
```

Use ES6 modules with `type="module"`:
```html
<script type="module" src="src/main.js"></script>
```

---

### 2. State Management Pattern
**Current:** Global `state` object with direct mutation

**Recommendation:** Implement a simple state management pattern for better debugging and time travel:

```javascript
// state-manager.js
export function createStore(initialState) {
    let state = initialState;
    const listeners = [];
    const history = [state];

    return {
        getState: () => state,

        setState: (updates) => {
            state = { ...state, ...updates };
            history.push(state);
            listeners.forEach(fn => fn(state));
        },

        subscribe: (fn) => {
            listeners.push(fn);
            return () => {
                const index = listeners.indexOf(fn);
                listeners.splice(index, 1);
            };
        },

        undo: () => {
            if (history.length > 1) {
                history.pop();
                state = history[history.length - 1];
                listeners.forEach(fn => fn(state));
            }
        }
    };
}
```

---

### 3. Testing Strategy
**Current:** No tests

**Recommendation:** Add tests for core logic, especially solver algorithms:

```javascript
// puzzle.test.js
import { describe, it, expect } from 'vitest';
import { computeHintLine, evaluateLine } from './puzzle.js';

describe('computeHintLine', () => {
    it('computes hints for simple line', () => {
        const line = [true, true, false, true, false, false];
        expect(computeHintLine(line)).toEqual([2, 1]);
    });

    it('returns [0] for empty line', () => {
        const line = [false, false, false];
        expect(computeHintLine(line)).toEqual([0]);
    });
});

describe('evaluateLine', () => {
    it('detects solved line', () => {
        const line = [CellState.FILLED, CellState.FILLED, CellState.MARKED];
        const hints = [2];
        const result = evaluateLine(line, hints);
        expect(result.solved).toBe(true);
        expect(result.contradiction).toBe(false);
    });

    it('detects contradiction (too many filled)', () => {
        const line = [CellState.FILLED, CellState.FILLED, CellState.FILLED];
        const hints = [2];
        const result = evaluateLine(line, hints);
        expect(result.contradiction).toBe(true);
    });
});
```

**Testing Framework:** [Vitest](https://vitest.dev/) - Fast, modern, Vite-powered

---

### 4. Accessibility Enhancements
**Current:** Good ARIA labels, but could be improved

**Recommendations:**

1. **Screen reader announcements:**
```javascript
function announceToScreenReader(message) {
    const announcer = document.getElementById('sr-announcer');
    announcer.textContent = message;
}

// In HTML:
// <div id="sr-announcer" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></div>

// Usage:
function evaluateBoard() {
    // ... existing code ...
    if (solved) {
        announceToScreenReader(`Puzzle solved! ${state.puzzle.name} complete.`);
    }
}
```

2. **Keyboard navigation for cells:**
```javascript
// Add arrow key navigation
document.addEventListener('keydown', (e) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

    const focusedCell = document.activeElement;
    if (!focusedCell.classList.contains('cell')) return;

    const row = parseInt(focusedCell.dataset.row);
    const col = parseInt(focusedCell.dataset.col);

    let newRow = row, newCol = col;
    if (e.key === 'ArrowUp') newRow = Math.max(0, row - 1);
    if (e.key === 'ArrowDown') newRow = Math.min(state.puzzle.height - 1, row + 1);
    if (e.key === 'ArrowLeft') newCol = Math.max(0, col - 1);
    if (e.key === 'ArrowRight') newCol = Math.min(state.puzzle.width - 1, col + 1);

    const newCell = state.cells[newRow][newCol];
    newCell.focus();
});

// Make cells focusable
function buildGrid() {
    // ... existing code ...
    cell.setAttribute('tabindex', '0');
}
```

3. **Colorblind mode:**
```css
/* Add high-contrast patterns instead of just colors */
.colorblind-mode .cell.filled {
    background: repeating-linear-gradient(
        45deg,
        #1d3557,
        #1d3557 3px,
        #2d4567 3px,
        #2d4567 6px
    );
}

.colorblind-mode .cell.contradiction {
    background: repeating-linear-gradient(
        -45deg,
        #ef476f,
        #ef476f 2px,
        white 2px,
        white 4px
    );
}
```

---

### 5. Performance Optimization
**Current:** Performance is good for small puzzles, but may struggle at 25x25+

**Optimizations:**

1. **Throttle evaluation:**
```javascript
// Don't re-evaluate on every cell change during drag
let evaluationQueued = false;

function paintCell(cell, action) {
    // ... existing code ...

    if (!evaluationQueued) {
        evaluationQueued = true;
        requestAnimationFrame(() => {
            evaluateBoard();
            evaluationQueued = false;
        });
    }
}
```

2. **Memoize hint calculations:**
```javascript
const hintCache = new Map();

function getHintsForLine(lineKey, cells) {
    if (hintCache.has(lineKey)) {
        return hintCache.get(lineKey);
    }
    const hints = computeHintLine(cells);
    hintCache.set(lineKey, hints);
    return hints;
}
```

3. **Virtual scrolling for large grids:**
For 30x30+ puzzles, only render visible portion of grid.

---

### 6. Progressive Web App (PWA)
**Effort: Low | Impact: Medium**

Add service worker and manifest to make installable on mobile devices.

**manifest.json:**
```json
{
    "name": "Nonograms / Picross",
    "short_name": "Nonograms",
    "description": "Logic puzzle game",
    "start_url": "/games/nonograms/",
    "display": "standalone",
    "background_color": "#eef2f7",
    "theme_color": "#118ab2",
    "icons": [
        {
            "src": "icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

**service-worker.js:**
```javascript
const CACHE_NAME = 'nonogram-v1';
const urlsToCache = [
    '/games/nonograms/',
    '/games/nonograms/index.html',
    '/games/nonograms/app.js',
    '/games/nonograms/style.css',
    '/games/nonograms/icon.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
```

**Resources:**
- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: PWA Checklist](https://web.dev/pwa-checklist/)

---

## Learning Resources

### Nonogram-Specific

1. **[Nonogram Wikipedia](https://en.wikipedia.org/wiki/Nonogram)**
   - History, solving techniques, complexity analysis

2. **[WebPBN (Web Paint-By-Number)](http://webpbn.com/)**
   - Large puzzle database with solver comparisons

3. **[Griddlers Solver](https://jsimlo.sk/griddlers/)**
   - Visual demonstration of solving algorithms

4. **[Solving Nonograms with 120 Lines of Code](https://towardsdatascience.com/solving-nonograms-with-120-lines-of-code-a7c6e0f627e4/)**
   - Python implementation of line-solving algorithm

### Puzzle Game Design

5. **[Level Progression and Pacing in Puzzle Games (Medium)](https://medium.com/@mdelally/level-progression-and-pacing-in-puzzle-games-eb9e6a97e571)**
   - Research-backed difficulty curve design

6. **[Game Developer: The Player's Progress](https://www.gamedeveloper.com/design/the-player-s-progress-designing-levels-for-mobile-puzzle-games)**
   - Mobile puzzle game level design patterns

7. **[Machinations.io: How to Design a Puzzle Game](https://machinations.io/articles/how-to-design-a-puzzle-game)**
   - Complete guide to puzzle game mechanics

8. **[Difficulty Curves: Balancing Challenge and Reward](https://designthegame.com/learning/tutorial/difficulty-curves-balancing-challenge-reward)**
   - Theory and practice of difficulty curves

### UX/UI Best Practices

9. **[Game-Ace: Complete Game UX Guide for 2025](https://game-ace.com/blog/the-complete-game-ux-guide/)**
   - Modern game UX principles

10. **[Mockplus: Game UX Design Complete Guide](https://www.mockplus.com/blog/post/game-ux-design-guide)**
    - Comprehensive UX patterns for games

11. **[PageFlows: Game UX - Reaching the High Score](https://pageflows.com/resources/game-ux-reaching-the-high-score/)**
    - Case studies and examples

### Web APIs

12. **[MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)**
    - localStorage and sessionStorage guide

13. **[MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)**
    - For storing large datasets

14. **[MDN: Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)**
    - Background processing for solver algorithms

15. **[MDN: Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)**
    - Unified mouse/touch/pen handling (already implemented well!)

### Algorithms & Computer Science

16. **[ScienceDirect: Nonograms - Combinatorial questions and algorithms](https://www.sciencedirect.com/science/article/pii/S0166218X14000080)**
    - Academic paper on solving algorithms

17. **[Rosetta Code: Nonogram Solver](https://rosettacode.org/wiki/Nonogram_solver)**
    - Implementations in multiple languages

18. **[GitHub: bbukaty/nonograms](https://github.com/bbukaty/nonograms)**
    - Python solver with clear algorithm explanation

---

## Additional Ideas

### 1. Social Features
- **Puzzle sharing:** Export puzzle as URL parameter or shareable code
- **Challenge friends:** Send a specific puzzle with your time to beat
- **Community puzzles:** User-submitted puzzle repository (requires backend)

### 2. Tutorial Mode
Interactive tutorial teaching solving techniques:
- Basic: Simple blocks, edge solving
- Intermediate: Overlaps, forced gaps
- Advanced: Multiple constraint solving, hypotheticals

### 3. Statistics Dashboard
Track and display:
- Total puzzles completed
- Total time spent
- Best solve times by puzzle
- Current streak
- Accuracy rate (moves without contradictions)
- Favorite difficulty level

### 4. Puzzle Variants
Experiment with alternative rule sets:
- **Mega Nonograms:** 50x50+ puzzles in scrollable viewport
- **Multi-grid:** Multiple small grids that combine into one image
- **Tricky Picross:** Some hints intentionally have multiple solutions
- **Infinite mode:** Procedurally generated endless puzzles

### 5. Accessibility - High Contrast Mode
Add a high-contrast toggle for users with visual impairments:
```css
.high-contrast-mode {
    --bg: #000000;
    --panel: #1a1a1a;
    --text: #ffffff;
    --filled: #ffff00;
    --marked: #00ffff;
    --grid-line: #ffffff;
    --contradiction: #ff0000;
}
```

### 6. Sound Effects
Add optional audio feedback:
- Soft click on cell fill
- Error sound on contradiction
- Victory jingle on puzzle complete
- Background music toggle

**Implementation:**
```javascript
const sounds = {
    fill: new Audio('sounds/fill.mp3'),
    mark: new Audio('sounds/mark.mp3'),
    error: new Audio('sounds/error.mp3'),
    victory: new Audio('sounds/victory.mp3')
};

function playSound(soundName) {
    if (state.soundEnabled) {
        sounds[soundName].currentTime = 0;
        sounds[soundName].play();
    }
}
```

### 7. Print Mode
Add print-friendly CSS for puzzle worksheets:
```css
@media print {
    .controls, .tools, .corner, button {
        display: none !important;
    }

    .puzzle-shell {
        box-shadow: none;
        break-inside: avoid;
    }

    .grid, .cell {
        border-color: #000 !important;
    }
}
```

---

## Implementation Priority Roadmap

### Phase 1: Essential Features (Week 1)
**Goal:** Make game more replayable and user-friendly
1. LocalStorage save state (Suggestion #1)
2. Undo/Redo system (Suggestion #2)
3. Puzzle completion tracking (Suggestion #3)
4. Keyboard shortcuts (Suggestion #5)

### Phase 2: Content Expansion (Week 2-3)
**Goal:** Significantly expand puzzle library
5. Add 20-25 new puzzles across 5 difficulty tiers (Suggestion #6)
6. Implement difficulty categories and puzzle browser

### Phase 3: Polish & Engagement (Week 3-4)
**Goal:** Improve UX and add retention features
7. Visual enhancements - highlighting, strikethrough (Suggestion #8)
8. Timer and statistics tracking (Suggestion #4)
9. Achievement system (Suggestion #10)
10. Mobile/touch optimizations (Suggestion #9)

### Phase 4: Advanced Features (Month 2+)
**Goal:** Power user features
11. Smart hint system with logical deductions (Suggestion #7)
12. Daily challenge mode (Suggestion #12)
13. PWA implementation for installability

### Phase 5: Stretch Goals (Future)
**Goal:** Ambitious expansions
14. Puzzle generator from images (Suggestion #11)
15. Puzzle editor (Suggestion #15)
16. Color nonograms (Suggestion #14)

---

## Notes

- **Development Philosophy:** Keep the zero-build-step approach unless complexity demands otherwise. Vanilla JS is a strength.

- **Mobile First:** Given touch controls are already implemented, prioritize mobile UX improvements early.

- **Offline Capability:** Maintain and enhance offline functionality - it's a key differentiator.

- **Accessibility:** Continue strong accessibility focus - keyboard navigation, screen readers, high contrast modes.

- **Performance:** Monitor performance carefully when adding features. Canvas rendering may become necessary for 20x20+ puzzles.

- **Research-Backed Design:** Apply puzzle game research on difficulty curves, progression, and engagement mechanics when expanding content.

---

Created with analysis and research by Claude Code for Luke Steuber.
