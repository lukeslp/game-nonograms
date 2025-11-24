const rawPuzzles = [
    // EASY - 5x5 puzzles for beginners
    {
        id: "heart",
        name: "Heart",
        difficulty: "easy",
        size: "5×5",
        description: "Simple heart shape - perfect first puzzle!",
        lines: [
            ".#.#.",
            "#####",
            "#####",
            ".###.",
            "..#..",
        ],
    },
    {
        id: "arrow",
        name: "Arrow",
        difficulty: "easy",
        size: "5×5",
        description: "Point the way forward.",
        lines: [
            "..#..",
            ".###.",
            "#####",
            "..#..",
            "..#..",
        ],
    },
    {
        id: "house",
        name: "House",
        difficulty: "easy",
        size: "5×5",
        description: "Home sweet home.",
        lines: [
            "..#..",
            ".###.",
            "#####",
            "#.#.#",
            "#####",
        ],
    },

    // MEDIUM - 10x10 puzzles with more complexity
    {
        id: "lantern",
        name: "Lantern",
        difficulty: "medium",
        size: "10×10",
        description: "A cozy lantern to warm up with.",
        lines: [
            "..###.....",
            ".#####....",
            "##.###....",
            "##..##....",
            "######....",
            "##..##....",
            "##..##....",
            "##..##....",
            ".#######..",
            "..#####...",
        ],
    },
    {
        id: "umbrella",
        name: "Umbrella",
        difficulty: "medium",
        size: "10×10",
        description: "Ready for rainy days.",
        lines: [
            "..######..",
            ".########.",
            "##########",
            "....##....",
            "....##....",
            "....##....",
            "....##....",
            "...####...",
            "..######..",
            ".########.",
        ],
    },
    {
        id: "rocket",
        name: "Rocket",
        difficulty: "medium",
        size: "10×10",
        description: "Blast off to puzzle mastery!",
        lines: [
            "....##....",
            "...####...",
            "..######..",
            "..######..",
            "..######..",
            "..######..",
            "..######..",
            ".########.",
            "##......##",
            ".#......#.",
        ],
    },

    // HARD - 12x12 puzzles requiring careful logic
    {
        id: "sprout",
        name: "Sprout",
        difficulty: "hard",
        size: "12×12",
        description: "A little sprout stretching toward the sun.",
        lines: [
            "..##......#.",
            "...##....##.",
            "..####..####",
            ".######.####",
            "######.#####",
            "#####..#####",
            "#####..#####",
            "######.#####",
            ".######.####",
            "..####..###.",
            "...###...##.",
            "....##......",
        ],
    },
    {
        id: "butterfly",
        name: "Butterfly",
        difficulty: "hard",
        size: "12×12",
        description: "Delicate wings in flight.",
        lines: [
            ".##....##...",
            "###...####..",
            "####.######.",
            ".##########.",
            "..########..",
            "...######...",
            "...######...",
            "..########..",
            ".##########.",
            "####.######.",
            "###...####..",
            ".##....##...",
        ],
    },
    {
        id: "sailboat",
        name: "Sailboat",
        difficulty: "hard",
        size: "12×12",
        description: "Smooth sailing ahead.",
        lines: [
            ".......#....",
            "......##....",
            ".....###....",
            "....####....",
            "...#####....",
            "..######....",
            ".#######....",
            "############",
            ".##########.",
            "..########..",
            "...######...",
            "....####....",
        ],
    },

    // EXPERT - 15x15 puzzles for masters
    {
        id: "compass",
        name: "Compass Burst",
        difficulty: "expert",
        size: "15×15",
        description: "A radial starburst to really flex your logic.",
        lines: [
            "...###...###...",
            "..#####.#####..",
            ".#############.",
            ".#############.",
            "#####.###.#####",
            "#####.###.#####",
            "######.#.######",
            "###############",
            "######.#.######",
            "#####.###.#####",
            "#####.###.#####",
            ".#############.",
            ".#############.",
            "..#####.#####..",
            "...###...###...",
        ],
    },
    {
        id: "owl",
        name: "Owl",
        difficulty: "expert",
        size: "15×15",
        description: "The wise owl watches over you.",
        lines: [
            "....#######....",
            "...#########...",
            "..###########..",
            "..###.###.###..",
            ".####.###.####.",
            ".####.###.####.",
            ".#############.",
            ".#############.",
            "..###########..",
            "...#########...",
            "....#######....",
            ".....#####.....",
            "......###......",
            ".......#.......",
            "...............",
        ],
    },
    {
        id: "castle",
        name: "Castle",
        difficulty: "expert",
        size: "15×15",
        description: "A fortress of logic puzzles.",
        lines: [
            "#.#.#.#.#.#.#.#",
            "###.#####.#####",
            "###.#####.#####",
            "###.#####.#####",
            "###############",
            "###############",
            "###...###...###",
            "###...###...###",
            "###...###...###",
            "###############",
            "###############",
            "###############",
            "....#######....",
            "....#######....",
            "....#######....",
        ],
    },
];

const CellState = Object.freeze({
    UNKNOWN: 0,
    FILLED: 1,
    MARKED: 2,
});

// Game progress and persistence
const GameProgress = {
    load() {
        const saved = localStorage.getItem('nonograms_progress');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load progress:', e);
            }
        }
        return {
            completed: [],
            stats: {
                totalSolved: 0,
                totalTime: 0,
                totalHintsUsed: 0,
                perfectSolves: 0,
                fastestTimes: {},
            },
            achievements: [],
            dailyStreak: 0,
            lastDaily: null,
            currentDifficulty: 'easy',
        };
    },
    save(data) {
        localStorage.setItem('nonograms_progress', JSON.stringify(data));
    },
    markCompleted(puzzleId, time, hintsUsed) {
        const progress = this.load();
        if (!progress.completed.includes(puzzleId)) {
            progress.completed.push(puzzleId);
        }
        progress.stats.totalSolved += 1;
        progress.stats.totalTime += time;
        progress.stats.totalHintsUsed += hintsUsed;
        if (hintsUsed === 0) {
            progress.stats.perfectSolves += 1;
        }

        // Track personal best times
        if (!progress.stats.fastestTimes[puzzleId] || time < progress.stats.fastestTimes[puzzleId]) {
            progress.stats.fastestTimes[puzzleId] = time;
        }

        this.save(progress);
        return progress;
    },
    checkAchievements(progress) {
        const newAchievements = [];

        if (progress.stats.totalSolved >= 1 && !progress.achievements.includes('first_solve')) {
            newAchievements.push({ id: 'first_solve', name: 'First Steps', desc: 'Solved your first puzzle!' });
        }
        if (progress.stats.totalSolved >= 5 && !progress.achievements.includes('novice')) {
            newAchievements.push({ id: 'novice', name: 'Novice Solver', desc: 'Solved 5 puzzles' });
        }
        if (progress.stats.totalSolved >= 10 && !progress.achievements.includes('apprentice')) {
            newAchievements.push({ id: 'apprentice', name: 'Apprentice', desc: 'Solved 10 puzzles' });
        }
        if (progress.stats.perfectSolves >= 3 && !progress.achievements.includes('perfectionist')) {
            newAchievements.push({ id: 'perfectionist', name: 'Perfectionist', desc: 'Solved 3 puzzles without hints' });
        }
        if (progress.stats.totalSolved >= progress.completed.length && !progress.achievements.includes('completionist')) {
            newAchievements.push({ id: 'completionist', name: 'Completionist', desc: 'Solved all available puzzles!' });
        }

        newAchievements.forEach(ach => {
            if (!progress.achievements.includes(ach.id)) {
                progress.achievements.push(ach.id);
            }
        });

        if (newAchievements.length > 0) {
            this.save(progress);
        }

        return newAchievements;
    },
    getDailyPuzzle() {
        const today = new Date().toDateString();
        const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return seed;
    },
    checkDailyStreak() {
        const progress = this.load();
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (progress.lastDaily === today) {
            return progress.dailyStreak;
        } else if (progress.lastDaily === yesterday) {
            progress.dailyStreak += 1;
        } else if (progress.lastDaily !== null) {
            progress.dailyStreak = 1;
        } else {
            progress.dailyStreak = 1;
        }

        progress.lastDaily = today;
        this.save(progress);
        return progress.dailyStreak;
    }
};

const state = {
    puzzles: [],
    puzzle: null,
    board: [],
    cells: [],
    rowHintEls: [],
    columnHintEls: [],
    tool: "fill",
    pointerId: null,
    strokeAction: null,
    // Performance tracking
    startTime: null,
    moveCount: 0,
    hintsUsed: 0,
    timerInterval: null,
    // Game progress
    progress: null,
    currentFilter: 'all',
};

const elements = {
    puzzlePicker: document.getElementById("puzzlePicker"),
    resetButton: document.getElementById("resetPuzzle"),
    shuffleButton: document.getElementById("newShuffled"),
    autoMarkToggle: document.getElementById("autoMark"),
    toolButtons: Array.from(document.querySelectorAll(".tool")),
    grid: document.getElementById("grid"),
    rowHints: document.getElementById("rowHints"),
    columnHints: document.getElementById("columnHints"),
    statusLine: document.getElementById("statusLine"),
    puzzleShell: document.querySelector(".puzzle-shell"),
};

function preparePuzzles(list) {
    return list.map((puzzle) => {
        const height = puzzle.lines.length;
        const width = puzzle.lines[0].length;
        const grid = puzzle.lines.map((line) => line.split("").map((ch) => ch === "#"));
        const rowHints = grid.map((row) => computeHintLine(row));
        const columnHints = Array.from({ length: width }, (_, colIdx) =>
            computeHintLine(grid.map((row) => row[colIdx]))
        );
        return {
            ...puzzle,
            width,
            height,
            grid,
            rowHints,
            columnHints,
        };
    });
}

function computeHintLine(line) {
    const hints = [];
    let run = 0;
    line.forEach((cell) => {
        if (cell) {
            run += 1;
        } else if (run) {
            hints.push(run);
            run = 0;
        }
    });
    if (run) {
        hints.push(run);
    }
    return hints.length ? hints : [0];
}

function normalizeHints(hints) {
    return hints.length === 1 && hints[0] === 0 ? [] : hints;
}

function init() {
    state.puzzles = preparePuzzles(rawPuzzles);
    populatePuzzlePicker();
    bindControls();
    loadPuzzle(state.puzzles[0].id);
}

function populatePuzzlePicker() {
    const frag = document.createDocumentFragment();
    state.puzzles.forEach((puzzle) => {
        const option = document.createElement("option");
        option.value = puzzle.id;
        option.textContent = puzzle.name;
        frag.appendChild(option);
    });
    elements.puzzlePicker.innerHTML = "";
    elements.puzzlePicker.appendChild(frag);
}

function bindControls() {
    elements.puzzlePicker.addEventListener("change", (event) => {
        loadPuzzle(event.target.value);
    });

    elements.resetButton.addEventListener("click", () => {
        resetBoard();
    });

    elements.shuffleButton.addEventListener("click", () => {
        shufflePuzzle();
    });

    elements.autoMarkToggle.addEventListener("change", () => {
        evaluateBoard();
    });

    elements.toolButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setTool(button.dataset.tool);
        });
    });

    elements.grid.addEventListener("pointerdown", handlePointerDown);
    elements.grid.addEventListener("pointermove", handlePointerMove);
    elements.grid.addEventListener("pointerup", handlePointerUp);
    elements.grid.addEventListener("pointercancel", handlePointerUp);
    elements.grid.addEventListener("contextmenu", (event) => event.preventDefault());

    setTool(state.tool);
}

function loadPuzzle(id) {
    const puzzle = state.puzzles.find((item) => item.id === id) ?? state.puzzles[0];
    state.puzzle = puzzle;
    elements.puzzlePicker.value = puzzle.id;
    elements.puzzleShell.style.setProperty("--cols", puzzle.width);
    elements.puzzleShell.style.setProperty("--rows", puzzle.height);
    buildHints();
    buildGrid();
    resetBoard();
    elements.statusLine.textContent = puzzle.description;
}

function shufflePuzzle() {
    if (!state.puzzles.length) {
        return;
    }
    let next = state.puzzles[Math.floor(Math.random() * state.puzzles.length)];
    if (state.puzzle && state.puzzles.length > 1) {
        while (next.id === state.puzzle.id) {
            next = state.puzzles[Math.floor(Math.random() * state.puzzles.length)];
        }
    }
    loadPuzzle(next.id);
}

function setTool(tool) {
    state.tool = tool;
    elements.toolButtons.forEach((button) => {
        const isActive = button.dataset.tool === tool;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

function buildHints() {
    elements.rowHints.innerHTML = "";
    elements.columnHints.innerHTML = "";
    state.rowHintEls = state.puzzle.rowHints.map((hints, rowIdx) => {
        const el = document.createElement("div");
        el.className = "hint-line";
        el.dataset.index = rowIdx;
        appendHintNumbers(el, hints);
        elements.rowHints.appendChild(el);
        return el;
    });
    state.columnHintEls = state.puzzle.columnHints.map((hints, colIdx) => {
        const el = document.createElement("div");
        el.className = "hint-line";
        el.dataset.index = colIdx;
        appendHintNumbers(el, hints);
        elements.columnHints.appendChild(el);
        return el;
    });
}

function appendHintNumbers(container, hints) {
    container.innerHTML = "";
    hints.forEach((hint) => {
        const span = document.createElement("span");
        span.textContent = hint;
        container.appendChild(span);
    });
}

function buildGrid() {
    const { height, width } = state.puzzle;
    state.cells = Array.from({ length: height }, () => Array.from({ length: width }, () => null));
    elements.grid.innerHTML = "";
    const frag = document.createDocumentFragment();
    for (let row = 0; row < height; row += 1) {
        for (let col = 0; col < width; col += 1) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = String(row);
            cell.dataset.col = String(col);
            cell.setAttribute("role", "gridcell");
            cell.setAttribute("aria-label", `Row ${row + 1}, Column ${col + 1}`);
            if (row % 5 === 0) {
                cell.style.borderTopWidth = "2px";
            }
            if (col % 5 === 0) {
                cell.style.borderLeftWidth = "2px";
            }
            frag.appendChild(cell);
            state.cells[row][col] = cell;
        }
    }
    elements.grid.appendChild(frag);
}

function resetBoard() {
    const { height, width } = state.puzzle;
    state.board = Array.from({ length: height }, () => Array(width).fill(CellState.UNKNOWN));
    state.cells.flat().forEach((cell) => {
        if (cell) {
            cell.classList.remove("filled", "marked", "contradiction");
        }
    });
    evaluateBoard();
}

function handlePointerDown(event) {
    if (event.button !== undefined && event.button !== 0 && event.pointerType !== "touch") {
        return;
    }
    const cell = event.target.closest(".cell");
    if (!cell) {
        return;
    }
    event.preventDefault();
    state.pointerId = event.pointerId;
    state.strokeAction = state.tool;
    if (elements.grid.setPointerCapture) {
        elements.grid.setPointerCapture(event.pointerId);
    }
    paintCell(cell, state.strokeAction);
}

function handlePointerMove(event) {
    if (state.pointerId !== event.pointerId || !state.strokeAction) {
        return;
    }
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const cell = target?.closest?.(".cell") ?? null;
    if (cell) {
        paintCell(cell, state.strokeAction);
    }
}

function handlePointerUp(event) {
    if (state.pointerId === event.pointerId) {
        if (elements.grid.hasPointerCapture?.(event.pointerId)) {
            elements.grid.releasePointerCapture(event.pointerId);
        }
    }
    state.pointerId = null;
    state.strokeAction = null;
}

function paintCell(cell, action) {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    let targetState = CellState.UNKNOWN;
    if (action === "fill") {
        targetState = CellState.FILLED;
    } else if (action === "mark") {
        targetState = CellState.MARKED;
    }
    if (updateCell(row, col, targetState)) {
        evaluateBoard();
    }
}

function updateCell(row, col, nextState) {
    if (state.board[row][col] === nextState) {
        return false;
    }
    state.board[row][col] = nextState;
    syncCell(row, col);
    return true;
}

function syncCell(row, col) {
    const cell = state.cells[row][col];
    cell.classList.toggle("filled", state.board[row][col] === CellState.FILLED);
    cell.classList.toggle("marked", state.board[row][col] === CellState.MARKED);
}

function evaluateBoard(options = {}) {
    if (!state.puzzle) {
        return;
    }
    const { skipAutoMark = false } = options;
    const rowStatuses = state.puzzle.rowHints.map((hints, rowIdx) =>
        evaluateLine(state.board[rowIdx], hints)
    );
    const columnStatuses = state.puzzle.columnHints.map((hints, colIdx) =>
        evaluateLine(state.board.map((row) => row[colIdx]), hints)
    );

    updateHintStyles(state.rowHintEls, rowStatuses);
    updateHintStyles(state.columnHintEls, columnStatuses);
    highlightGridConflicts(rowStatuses, columnStatuses);

    const solved =
        rowStatuses.every((status) => status.solved) && columnStatuses.every((status) => status.solved);
    const contradictionsPresent =
        rowStatuses.some((status) => status.contradiction) ||
        columnStatuses.some((status) => status.contradiction);
    const hasMoves = state.board.some((row) => row.some((cell) => cell !== CellState.UNKNOWN));
    updateStatusLine(solved, contradictionsPresent, hasMoves);

    if (!skipAutoMark && elements.autoMarkToggle.checked) {
        const changed = autoMarkSolvedLines(rowStatuses, columnStatuses);
        if (changed) {
            evaluateBoard({ skipAutoMark: true });
        }
    }
}

function evaluateLine(line, displayHints) {
    const hints = normalizeHints(displayHints);
    const runs = [];
    let streak = 0;
    line.forEach((value) => {
        if (value === CellState.FILLED) {
            streak += 1;
        } else if (streak) {
            runs.push(streak);
            streak = 0;
        }
    });
    if (streak) {
        runs.push(streak);
    }
    const filledCount = runs.reduce((sum, run) => sum + run, 0);
    const target = hints.reduce((sum, hint) => sum + hint, 0);
    const maxHint = hints.length ? Math.max(...hints) : 0;
    let contradiction = false;
    if (!hints.length && filledCount > 0) {
        contradiction = true;
    }
    if (filledCount > target) {
        contradiction = true;
    }
    if (runs.some((run) => run > maxHint)) {
        contradiction = true;
    }
    const solved =
        !contradiction &&
        filledCount === target &&
        runs.length === hints.length &&
        runs.every((run, idx) => run === hints[idx]);
    return { runs, contradiction, solved };
}

function updateHintStyles(elementsList, statuses) {
    elementsList.forEach((el, idx) => {
        const status = statuses[idx];
        el.classList.toggle("contradiction", status.contradiction);
        el.classList.toggle("complete", status.solved);
    });
}

function highlightGridConflicts(rowStatuses, columnStatuses) {
    const rowFlags = rowStatuses.map((status) => status.contradiction);
    const colFlags = columnStatuses.map((status) => status.contradiction);
    for (let row = 0; row < state.puzzle.height; row += 1) {
        for (let col = 0; col < state.puzzle.width; col += 1) {
            const hasIssue = rowFlags[row] || colFlags[col];
            state.cells[row][col].classList.toggle("contradiction", hasIssue);
        }
    }
}

function autoMarkSolvedLines(rowStatuses, columnStatuses) {
    let changed = false;
    rowStatuses.forEach((status, rowIdx) => {
        if (status.solved) {
            for (let col = 0; col < state.puzzle.width; col += 1) {
                if (state.board[rowIdx][col] === CellState.UNKNOWN) {
                    changed = updateCell(rowIdx, col, CellState.MARKED) || changed;
                }
            }
        }
    });
    columnStatuses.forEach((status, colIdx) => {
        if (status.solved) {
            for (let row = 0; row < state.puzzle.height; row += 1) {
                if (state.board[row][colIdx] === CellState.UNKNOWN) {
                    changed = updateCell(row, colIdx, CellState.MARKED) || changed;
                }
            }
        }
    });
    return changed;
}

function updateStatusLine(solved, contradictionsPresent, hasMoves) {
    if (!state.puzzle) {
        elements.statusLine.textContent = "Pick a puzzle to begin.";
        return;
    }
    if (solved) {
        elements.statusLine.textContent = `Solved ${state.puzzle.name}! ${state.puzzle.description}`;
    } else if (contradictionsPresent) {
        elements.statusLine.textContent = "Contradictions glow in pink – adjust until the numbers fit.";
    } else if (!hasMoves) {
        elements.statusLine.textContent = state.puzzle.description;
    } else {
        elements.statusLine.textContent = "Drag to fill or mark. Numbers count contiguous filled groups.";
    }
}

window.addEventListener("pointerup", () => {
    state.pointerId = null;
    state.strokeAction = null;
});

init();
