/* =========================================
   DARSHAN MEMORY CHALLENGE
   ========================================= */

const boardElement =
    document.getElementById("memory-board");

const statusElement =
    document.getElementById("game-status");

const timerElement =
    document.getElementById("timer");

const movesElement =
    document.getElementById("moves");

const pairsElement =
    document.getElementById("pairs");

const newGameButton =
    document.getElementById("new-game");

const completionSection =
    document.getElementById("completion-section");

const finalTimeElement =
    document.getElementById("final-time");

const finalMovesElement =
    document.getElementById("final-moves");

const resultMessageElement =
    document.getElementById("result-message");

const playAgainButton =
    document.getElementById("play-again");


/* =========================================
   GAME SETTINGS
   ========================================= */

const symbols = [
    "♟",
    "♞",
    "♜",
    "♛",
    "★",
    "◆",
    "●",
    "☀"
];

const totalPairs = symbols.length;


/* =========================================
   GAME STATE
   ========================================= */

let cards = [];

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let moves = 0;
let matchedPairs = 0;

let seconds = 0;
let timer = null;

let gameStarted = false;
let gameFinished = false;


/* =========================================
   SHUFFLE
   ========================================= */

function shuffle(array) {

    const shuffled = [...array];

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            shuffled[i],
            shuffled[j]
        ] = [
            shuffled[j],
            shuffled[i]
        ];
    }

    return shuffled;
}


/* =========================================
   CREATE DECK
   ========================================= */

function createDeck() {

    const pairCards = [
        ...symbols,
        ...symbols
    ];

    return shuffle(pairCards);
}


/* =========================================
   CREATE BOARD
   ========================================= */

function renderBoard() {

    boardElement.innerHTML = "";

    cards.forEach((symbol, index) => {

        const card =
            document.createElement("button");

        card.type = "button";

        card.className =
            "memory-card";

        card.dataset.index = index;


        const inner =
            document.createElement("span");

        inner.className =
            "card-inner";


        const front =
            document.createElement("span");

        front.className =
            "card-front";


        const back =
            document.createElement("span");

        back.className =
            "card-back";

        back.textContent = symbol;


        inner.appendChild(front);
        inner.appendChild(back);

        card.appendChild(inner);


        card.addEventListener(
            "click",
            () => flipCard(card, index)
        );


        boardElement.appendChild(card);

    });
}


/* =========================================
   FLIP CARD
   ========================================= */

function flipCard(card, index) {

    if (lockBoard) return;

    if (gameFinished) return;

    if (card === firstCard) return;

    if (
        card.classList.contains("matched")
    ) {
        return;
    }


    /* Start timer on first move */

    if (!gameStarted) {

        gameStarted = true;

        startTimer();
    }


    card.classList.add("flipped");


    if (!firstCard) {

        firstCard = card;

        return;
    }


    secondCard = card;

    moves++;

    movesElement.textContent =
        moves;

    checkMatch();
}


/* =========================================
   CHECK MATCH
   ========================================= */

function checkMatch() {

    const firstIndex =
        Number(
            firstCard.dataset.index
        );

    const secondIndex =
        Number(
            secondCard.dataset.index
        );


    const firstSymbol =
        cards[firstIndex];

    const secondSymbol =
        cards[secondIndex];


    if (
        firstSymbol ===
        secondSymbol
    ) {

        handleMatch();

    } else {

        handleMismatch();
    }
}


/* =========================================
   MATCH
   ========================================= */

function handleMatch() {

    firstCard.classList.add("matched");

    secondCard.classList.add("matched");

    firstCard.disabled = true;
    secondCard.disabled = true;


    matchedPairs++;

    pairsElement.textContent =
        `${matchedPairs} / ${totalPairs}`;


    statusElement.textContent =
        "Excellent! You found a pair.";


    resetSelection();


    if (
        matchedPairs === totalPairs
    ) {

        finishGame();
    }
}


/* =========================================
   MISMATCH
   ========================================= */

function handleMismatch() {

    lockBoard = true;

    statusElement.textContent =
        "Not a match. Remember their positions.";


    setTimeout(() => {

        firstCard.classList.remove(
            "flipped"
        );

        secondCard.classList.remove(
            "flipped"
        );

        resetSelection();

    }, 900);
}


/* =========================================
   RESET SELECTION
   ========================================= */

function resetSelection() {

    firstCard = null;
    secondCard = null;

    lockBoard = false;
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
        "All pairs found!";


    finalTimeElement.textContent =
        timerElement.textContent;


    finalMovesElement.textContent =
        moves;


    let message;


    if (moves <= totalPairs + 2) {

        message =
            "Outstanding memory! Your focus is remarkable.";

    } else if (moves <= totalPairs * 2) {

        message =
            "Excellent work! Your memory stayed sharp.";

    } else if (moves <= totalPairs * 3) {

        message =
            "Well done! Keep challenging your mind.";

    } else {

        message =
            "You completed the challenge. Try again and beat your score!";
    }


    resultMessageElement.textContent =
        message;


    completionSection.hidden = false;


    completionSection.scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================================
   NEW GAME
   ========================================= */

function newGame() {

    stopTimer();


    cards = createDeck();


    firstCard = null;
    secondCard = null;

    lockBoard = false;

    moves = 0;

    matchedPairs = 0;

    seconds = 0;

    gameStarted = false;

    gameFinished = false;


    movesElement.textContent =
        "0";

    pairsElement.textContent =
        `0 / ${totalPairs}`;

    timerElement.textContent =
        "00:00";

    statusElement.textContent =
        "Find the matching pairs";


    completionSection.hidden = true;


    renderBoard();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   BUTTONS
   ========================================= */

newGameButton.addEventListener(
    "click",
    newGame
);


playAgainButton.addEventListener(
    "click",
    newGame
);


/* =========================================
   START GAME
   ========================================= */

newGame();