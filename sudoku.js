/* =========================================
   DARSHAN SUDOKU
   ========================================= */

const boardElement = document.getElementById("sudoku-board");
const numberPad = document.getElementById("number-pad");

const statusElement = document.getElementById("game-status");
const timerElement = document.getElementById("timer");
const mistakesElement = document.getElementById("mistakes");

const newGameButton = document.getElementById("new-game");
const checkButton = document.getElementById("check-puzzle");

const completionSection =
    document.getElementById("completion-section");

const finalTimeElement =
    document.getElementById("final-time");

const finalMistakesElement =
    document.getElementById("final-mistakes");

const playAgainButton =
    document.getElementById("play-again");


/* =========================================
   GAME STATE
   ========================================= */

let puzzle = [];
let solution = [];

let userBoard = [];

let selectedRow = -1;
let selectedCol = -1;

let mistakes = 0;
let seconds = 0;

let timer = null;
let gameFinished = false;


/* =========================================
   SUDOKU HELPERS
   ========================================= */

function createEmptyBoard() {

    return Array.from(
        { length: 9 },
        () => Array(9).fill(0)
    );
}


function shuffle(array) {

    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [result[i], result[j]] =
            [result[j], result[i]];
    }

    return result;
}


/* =========================================
   SOLVE SUDOKU
   ========================================= */

function isValid(board, row, col, number) {

    for (let i = 0; i < 9; i++) {

        if (
            board[row][i] === number ||
            board[i][col] === number
        ) {
            return false;
        }
    }


    const boxRow =
        Math.floor(row / 3) * 3;

    const boxCol =
        Math.floor(col / 3) * 3;


    for (let r = boxRow; r < boxRow + 3; r++) {

        for (
            let c = boxCol;
            c < boxCol + 3;
            c++
        ) {

            if (board[r][c] === number) {
                return false;
            }
        }
    }

    return true;
}


function solveBoard(board) {

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            if (board[row][col] === 0) {

                const numbers =
                    shuffle(
                        [1, 2, 3, 4, 5, 6, 7, 8, 9]
                    );


                for (const number of numbers) {

                    if (
                        isValid(
                            board,
                            row,
                            col,
                            number
                        )
                    ) {

                        board[row][col] = number;


                        if (solveBoard(board)) {
                            return true;
                        }


                        board[row][col] = 0;
                    }
                }


                return false;
            }
        }
    }

    return true;
}


/* =========================================
   CREATE PUZZLE
   ========================================= */

function generatePuzzle() {

    solution = createEmptyBoard();

    solveBoard(solution);


    puzzle =
        solution.map(row => [...row]);


    /*
       Remove numbers to create the puzzle.

       45 empty cells gives a medium-level puzzle.
    */

    let cellsToRemove = 45;


    while (cellsToRemove > 0) {

        const row =
            Math.floor(Math.random() * 9);

        const col =
            Math.floor(Math.random() * 9);


        if (puzzle[row][col] !== 0) {

            puzzle[row][col] = 0;

            cellsToRemove--;
        }
    }


    userBoard =
        puzzle.map(row => [...row]);
}


/* =========================================
   DRAW BOARD
   ========================================= */

function renderBoard() {

    boardElement.innerHTML = "";


    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const cell =
                document.createElement("div");

            cell.className =
                "sudoku-cell";


            cell.dataset.row = row;
            cell.dataset.col = col;


            /*
               Strong borders after every
               third row and column.
            */

            if (col === 2 || col === 5) {
                cell.classList.add("box-right");
            }

            if (row === 2 || row === 5) {
                cell.classList.add("box-bottom");
            }


            const value =
                userBoard[row][col];


            if (puzzle[row][col] !== 0) {

                cell.classList.add("given");

                cell.textContent =
                    puzzle[row][col];

            } else if (value !== 0) {

                cell.classList.add("user-number");

                cell.textContent =
                    value;
            }


            cell.addEventListener(
                "click",
                () => selectCell(row, col)
            );


            boardElement.appendChild(cell);
        }
    }


    highlightCells();
}


/* =========================================
   SELECT CELL
   ========================================= */

function selectCell(row, col) {

    if (gameFinished) return;


    /*
       Original puzzle numbers cannot
       be changed.
    */

    if (puzzle[row][col] !== 0) {

        selectedRow = row;
        selectedCol = col;

        highlightCells();

        return;
    }


    selectedRow = row;
    selectedCol = col;

    highlightCells();
}


/* =========================================
   HIGHLIGHT
   ========================================= */

function highlightCells() {

    const cells =
        document.querySelectorAll(
            ".sudoku-cell"
        );


    cells.forEach(cell => {

        cell.classList.remove(
            "selected",
            "highlighted",
            "same-number"
        );


        const row =
            Number(cell.dataset.row);

        const col =
            Number(cell.dataset.col);


        if (
            row === selectedRow ||
            col === selectedCol
        ) {

            cell.classList.add(
                "highlighted"
            );
        }


        if (
            selectedRow !== -1 &&
            selectedCol !== -1
        ) {

            const boxRow =
                Math.floor(selectedRow / 3);

            const boxCol =
                Math.floor(selectedCol / 3);

            const cellBoxRow =
                Math.floor(row / 3);

            const cellBoxCol =
                Math.floor(col / 3);


            if (
                boxRow === cellBoxRow &&
                boxCol === cellBoxCol
            ) {

                cell.classList.add(
                    "highlighted"
                );
            }
        }


        if (
            row === selectedRow &&
            col === selectedCol
        ) {

            cell.classList.add(
                "selected"
            );
        }
    });


    /*
       Highlight cells containing
       the same number.
    */

    if (
        selectedRow !== -1 &&
        selectedCol !== -1
    ) {

        const number =
            userBoard[selectedRow][selectedCol];


        if (number !== 0) {

            cells.forEach(cell => {

                const row =
                    Number(cell.dataset.row);

                const col =
                    Number(cell.dataset.col);


                if (
                    userBoard[row][col] ===
                    number
                ) {

                    cell.classList.add(
                        "same-number"
                    );
                }
            });
        }
    }
}


/* =========================================
   ENTER NUMBER
   ========================================= */

function enterNumber(number) {

    if (gameFinished) return;

    if (
        selectedRow === -1 ||
        selectedCol === -1
    ) {
        statusElement.textContent =
            "Select a cell first.";

        return;
    }


    /*
       Don't overwrite original clues.
    */

    if (
        puzzle[selectedRow][selectedCol] !== 0
    ) {

        statusElement.textContent =
            "That number is fixed.";

        return;
    }


    if (number === "clear") {

        userBoard[selectedRow][selectedCol] =
            0;

        statusElement.textContent =
            "Cell cleared.";

        renderBoard();

        return;
    }


    const value =
        Number(number);


    /*
       Correct-answer validation.
    */

    if (
        value !==
        solution[selectedRow][selectedCol]
    ) {

        mistakes++;

        mistakesElement.textContent =
            mistakes;

        statusElement.textContent =
            "Not quite. Try another number.";

        markError(
            selectedRow,
            selectedCol
        );

        return;
    }


    userBoard[selectedRow][selectedCol] =
        value;


    statusElement.textContent =
        "Good move.";


    renderBoard();


    if (isPuzzleComplete()) {

        finishGame();
    }
}


/* =========================================
   ERROR MARK
   ========================================= */

function markError(row, col) {

    const cell =
        document.querySelector(
            `[data-row="${row}"][data-col="${col}"]`
        );


    if (!cell) return;


    cell.classList.add("error");


    setTimeout(() => {

        cell.classList.remove("error");

    }, 600);
}


/* =========================================
   CHECK PUZZLE
   ========================================= */

function checkPuzzle() {

    if (gameFinished) return;


    let emptyCells = 0;

    let incorrectCells = 0;


    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            if (userBoard[row][col] === 0) {

                emptyCells++;

            } else if (
                userBoard[row][col] !==
                solution[row][col]
            ) {

                incorrectCells++;
            }
        }
    }


    if (incorrectCells > 0) {

        statusElement.textContent =
            "There are incorrect numbers.";

        return;
    }


    if (emptyCells > 0) {

        statusElement.textContent =
            `${emptyCells} cells remaining.`;

        return;
    }


    finishGame();
}


/* =========================================
   COMPLETE CHECK
   ========================================= */

function isPuzzleComplete() {

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            if (
                userBoard[row][col] !==
                solution[row][col]
            ) {

                return false;
            }
        }
    }

    return true;
}


/* =========================================
   TIMER
   ========================================= */

function startTimer() {

    stopTimer();

    seconds = 0;

    updateTimer();


    timer =
        setInterval(() => {

            seconds++;

            updateTimer();

        }, 1000);
}


function stopTimer() {

    if (timer) {

        clearInterval(timer);

        timer = null;
    }
}


function updateTimer() {

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;


    timerElement.textContent =
        `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
}


/* =========================================
   FINISH GAME
   ========================================= */

function finishGame() {

    gameFinished = true;

    stopTimer();


    statusElement.textContent =
        "Puzzle complete!";


    finalTimeElement.textContent =
        timerElement.textContent;


    finalMistakesElement.textContent =
        mistakes;


    completionSection.hidden = false;


    completionSection.scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================================
   NEW GAME
   ========================================= */

function newGame() {

    gameFinished = false;

    mistakes = 0;

    selectedRow = -1;
    selectedCol = -1;


    mistakesElement.textContent =
        "0";


    statusElement.textContent =
        "Complete the puzzle";


    completionSection.hidden = true;


    generatePuzzle();

    renderBoard();

    startTimer();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   NUMBER PAD
   ========================================= */

numberPad.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest("button");


        if (!button) return;


        const number =
            button.dataset.number;


        enterNumber(number);
    }
);


/* =========================================
   KEYBOARD SUPPORT
   ========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (gameFinished) return;


        if (
            event.key >= "1" &&
            event.key <= "9"
        ) {

            enterNumber(event.key);

            return;
        }


        if (
            event.key === "Backspace" ||
            event.key === "Delete"
        ) {

            enterNumber("clear");
        }
    }
);


/* =========================================
   BUTTONS
   ========================================= */

newGameButton.addEventListener(
    "click",
    newGame
);


checkButton.addEventListener(
    "click",
    checkPuzzle
);


playAgainButton.addEventListener(
    "click",
    newGame
);


/* =========================================
   START
   ========================================= */

newGame();