
const GAME_LENGTH = 10;
let gamePuzzles = [];

const puzzles = [

    {
        question: "What number comes next? 2, 4, 8, 16, ?",
        options: ["20", "24", "32", "36"],
        answer: "32"
    },

    {
        question: "What number comes next? 3, 6, 11, 18, ?",
        options: ["24", "25", "27", "29"],
        answer: "27"
    },

    {
        question: "If all Bloops are Razzies, and all Razzies are Lazzies, are all Bloops definitely Lazzies?",
        options: ["Yes", "No", "Only sometimes", "Cannot be determined"],
        answer: "Yes"
    },

    {
        question: "Which number does not belong? 4, 9, 16, 25, 30",
        options: ["9", "16", "25", "30"],
        answer: "30"
    },

    {
        question: "A clock shows 3:15. What is the smaller angle between the hour and minute hands?",
        options: ["0°", "7.5°", "15°", "22.5°"],
        answer: "7.5°"
    },

    {
        question: "What comes next? A, C, F, J, O, ?",
        options: ["S", "T", "U", "V"],
        answer: "U"
    },

    {
        question: "A farmer has 17 sheep. All but 9 run away. How many sheep remain?",
        options: ["8", "9", "17", "0"],
        answer: "9"
    },

    {
        question: "What number completes the pattern? 1, 4, 9, 16, ?",
        options: ["20", "24", "25", "36"],
        answer: "25"
    },

    {
        question: "You have one match. In a dark room there is a candle, a lamp and a fireplace. What do you light first?",
        options: ["Candle", "Lamp", "Fireplace", "The match"],
        answer: "The match"
    },

    {
        question: "Which word can be made by rearranging the letters in 'LISTEN'?",
        options: ["SILENT", "LITTLE", "LINEST", "TINSEL"],
        answer: "SILENT"
    },

    {
        question: "What number comes next? 5, 10, 20, 40, ?",
        options: ["60", "70", "80", "100"],
        answer: "80"
    },

    {
        question: "What number comes next? 1, 3, 6, 10, 15, ?",
        options: ["18", "20", "21", "25"],
        answer: "21"
    },

    {
        question: "Which number is different? 8, 27, 64, 100, 125",
        options: ["27", "64", "100", "125"],
        answer: "100"
    },

    {
        question: "What comes next? Z, X, U, Q, L, ?",
        options: ["F", "G", "H", "I"],
        answer: "F"
    },

    {
        question: "If 5 machines make 5 items in 5 minutes, how long would 1 machine take to make 1 item?",
        options: ["1 minute", "5 minutes", "10 minutes", "25 minutes"],
        answer: "5 minutes"
    },

    {
        question: "What number comes next? 100, 90, 81, 73, ?",
        options: ["64", "66", "67", "68"],
        answer: "66"
    },

    {
        question: "A dozen eggs costs ₹60. How much does one egg cost?",
        options: ["₹4", "₹5", "₹6", "₹10"],
        answer: "₹5"
    },

    {
        question: "Which shape has the most sides?",
        options: ["Triangle", "Square", "Pentagon", "Hexagon"],
        answer: "Hexagon"
    },

    {
        question: "What number is missing? 2, 6, 12, 20, 30, ?",
        options: ["36", "40", "42", "44"],
        answer: "42"
    },

    {
        question: "If today is Monday, what day will it be 10 days from now?",
        options: ["Wednesday", "Thursday", "Friday", "Saturday"],
        answer: "Thursday"
    },

    {
        question: "What number comes next? 81, 27, 9, 3, ?",
        options: ["0", "1", "2", "6"],
        answer: "1"
    },

    {
        question: "Which word does not belong?",
        options: ["Apple", "Banana", "Carrot", "Mango"],
        answer: "Carrot"
    },

    {
        question: "A train travels 60 km in one hour. How far will it travel in 3 hours?",
        options: ["120 km", "150 km", "180 km", "240 km"],
        answer: "180 km"
    },

    {
        question: "What number comes next? 7, 14, 28, 56, ?",
        options: ["84", "98", "112", "120"],
        answer: "112"
    },

    {
        question: "Which number is both even and divisible by 3?",
        options: ["7", "9", "12", "15"],
        answer: "12"
    },

    {
        question: "What comes next? B, E, H, K, ?",
        options: ["L", "M", "N", "O"],
        answer: "N"
    },

    {
        question: "A room has 4 corners. In each corner sits one cat. Each cat sees 3 cats. How many cats are there?",
        options: ["3", "4", "8", "12"],
        answer: "4"
    },

    {
        question: "What number comes next? 2, 3, 5, 8, 13, ?",
        options: ["18", "20", "21", "22"],
        answer: "21"
    },

    {
        question: "Which is the odd one out?",
        options: ["Mercury", "Venus", "Earth", "Moon"],
        answer: "Moon"
    },

    {
        question: "If 3 pencils cost ₹15, how much do 8 pencils cost?",
        options: ["₹30", "₹35", "₹40", "₹45"],
        answer: "₹40"
    },

    {
        question: "What number completes the pattern? 10, 20, 40, 80, ?",
        options: ["100", "120", "140", "160"],
        answer: "160"
    },

    {
        question: "Which word is the opposite of 'ancient'?",
        options: ["Old", "Modern", "Historic", "Past"],
        answer: "Modern"
    },

    {
        question: "What number comes next? 50, 45, 40, 35, ?",
        options: ["25", "28", "30", "32"],
        answer: "30"
    },

    {
        question: "If a dozen is 12, what is a score?",
        options: ["10", "15", "20", "25"],
        answer: "20"
    },

    {
        question: "What comes next? 1, 2, 4, 7, 11, ?",
        options: ["14", "15", "16", "17"],
        answer: "16"
    },

    {
        question: "Which number is a prime number?",
        options: ["21", "27", "29", "33"],
        answer: "29"
    },

    {
        question: "A basket contains 10 apples. You take away 3. How many apples do you have?",
        options: ["3", "7", "10", "13"],
        answer: "3"
    },

    {
        question: "What number comes next? 4, 8, 12, 16, ?",
        options: ["18", "20", "22", "24"],
        answer: "20"
    },

    {
        question: "Which one does not belong? Circle, Triangle, Square, Cube",
        options: ["Circle", "Triangle", "Square", "Cube"],
        answer: "Cube"
    },

    {
        question: "If 2 + 3 = 10 and 3 + 4 = 21, then 4 + 5 = ?",
        options: ["30", "32", "36", "40"],
        answer: "36"
    },

    {
        question: "What number comes next? 9, 18, 36, 72, ?",
        options: ["108", "126", "144", "162"],
        answer: "144"
    },

    {
        question: "Which month has 28 days?",
        options: ["February", "January", "All months", "Only leap-year February"],
        answer: "All months"
    },

    {
        question: "What comes next? C, F, I, L, ?",
        options: ["M", "N", "O", "P"],
        answer: "O"
    },

    {
        question: "A father is 40 years old and his son is 10. How many years from now will the father be twice his son's age?",
        options: ["10", "15", "20", "25"],
        answer: "20"
    },

    {
        question: "What number comes next? 1, 8, 27, 64, ?",
        options: ["81", "100", "125", "144"],
        answer: "125"
    },

    {
        question: "Which number is missing? 11, 22, 33, 44, ?",
        options: ["50", "55", "66", "77"],
        answer: "55"
    },

    {
        question: "If all roses are flowers and some flowers fade quickly, can we conclude that all roses fade quickly?",
        options: ["Yes", "No", "Always", "Only in summer"],
        answer: "No"
    },

    {
        question: "What number comes next? 3, 9, 27, 81, ?",
        options: ["162", "189", "243", "324"],
        answer: "243"
    },

    {
        question: "A clock shows exactly 6:00. What is the angle between the hands?",
        options: ["90°", "120°", "180°", "360°"],
        answer: "180°"
    },

    {
        question: "Which word does not belong?",
        options: ["Run", "Walk", "Jump", "Blue"],
        answer: "Blue"
    },

    {
        question: "What number comes next? 20, 18, 15, 11, ?",
        options: ["8", "7", "6", "5"],
        answer: "6"
    },

    {
        question: "If you rearrange the letters in 'EARTH', which word can you make?",
        options: ["HEART", "EAR", "TEAR", "HEAT"],
        answer: "HEART"
    }

];




let currentPuzzle = 0;
let score = 0;
let answered = false;




const questionElement =
    document.getElementById("question");

const optionsElement =
    document.getElementById("answer-options");

const questionNumberElement =
    document.getElementById("question-number");

const scoreElement =
    document.getElementById("score");

const feedbackElement =
    document.getElementById("feedback");

const nextButton =
    document.getElementById("next-button");

const resultSection =
    document.getElementById("result-section");

const finalScoreElement =
    document.getElementById("final-score");

const resultMessageElement =
    document.getElementById("result-message");

const restartButton =
    document.getElementById("restart-button");


/* =========================================
   CREATE A NEW RANDOM 10-PUZZLE GAME
   ========================================= */

function createNewGame() {

    const shuffled =
        [...puzzles].sort(
            () => Math.random() - 0.5
        );

    gamePuzzles =
        shuffled.slice(0, GAME_LENGTH);
}


/* =========================================
   LOAD PUZZLE
   ========================================= */

function loadPuzzle() {

    answered = false;

    const puzzle =
        gamePuzzles[currentPuzzle];

    questionNumberElement.textContent =
        `${currentPuzzle + 1} / ${GAME_LENGTH}`;

    scoreElement.textContent =
        score;

    questionElement.textContent =
        puzzle.question;

    feedbackElement.textContent =
        "";

    feedbackElement.className =
        "feedback";

    nextButton.hidden =
        true;

    optionsElement.innerHTML =
        "";


    puzzle.options.forEach(option => {

        const button =
            document.createElement("button");

        button.className =
            "answer-option";

        button.type =
            "button";

        button.textContent =
            option;

        button.addEventListener(
            "click",
            () => checkAnswer(
                button,
                option
            )
        );

        optionsElement.appendChild(
            button
        );

    });
}


/* =========================================
   CHECK ANSWER
   ========================================= */

function checkAnswer(
    button,
    selectedAnswer
) {

    if (answered) return;

    answered = true;

    const puzzle =
        gamePuzzles[currentPuzzle];

    const buttons =
        optionsElement.querySelectorAll(
            ".answer-option"
        );


    buttons.forEach(optionButton => {

        optionButton.disabled =
            true;

        if (
            optionButton.textContent ===
            puzzle.answer
        ) {

            optionButton.classList.add(
                "correct"
            );

        }

    });


    if (
        selectedAnswer ===
        puzzle.answer
    ) {

        score++;

        scoreElement.textContent =
            score;

        button.classList.add(
            "correct"
        );

        feedbackElement.textContent =
            "Correct! Excellent thinking.";

        feedbackElement.className =
            "feedback correct";

    } else {

        button.classList.add(
            "incorrect"
        );

        feedbackElement.textContent =
            `Not quite. The correct answer is ${puzzle.answer}.`;

        feedbackElement.className =
            "feedback incorrect";
    }


    /*
       After question 10,
       show the final score.
    */

    if (
        currentPuzzle ===
        GAME_LENGTH - 1
    ) {

        nextButton.textContent =
            "SEE MY SCORE";

    } else {

        nextButton.textContent =
            "NEXT PUZZLE";
    }


    nextButton.hidden =
        false;
}


/* =========================================
   NEXT PUZZLE
   ========================================= */

function showNextPuzzle() {

    if (!answered) return;

    currentPuzzle++;


    if (
        currentPuzzle >=
        GAME_LENGTH
    ) {

        showResult();

        return;
    }


    loadPuzzle();
}


/* =========================================
   SHOW RESULT
   ========================================= */

function showResult() {

    document.querySelector(
        ".puzzle-section"
    ).style.display =
        "none";

    resultSection.hidden =
        false;


    finalScoreElement.textContent =
        `${score} / ${GAME_LENGTH}`;


    let message;

    const percentage =
        (score / GAME_LENGTH) * 100;


    if (percentage === 100) {

        message =
            "Perfect score! Your reasoning is sharp.";

    } else if (percentage >= 80) {

        message =
            "Excellent work! Your mind is working beautifully.";

    } else if (percentage >= 60) {

        message =
            "Great job! Keep challenging yourself.";

    } else if (percentage >= 40) {

        message =
            "Good effort. A little more practice will sharpen your thinking.";

    } else {

        message =
            "Every puzzle is a chance to learn. Try again!";
    }


    resultMessageElement.textContent =
        message;
}


/* =========================================
   RESTART GAME
   ========================================= */

function restartGame() {

    currentPuzzle = 0;

    score = 0;

    answered = false;


    resultSection.hidden =
        true;


    document.querySelector(
        ".puzzle-section"
    ).style.display =
        "";


    /*
       Create a completely new
       random set of 10 puzzles.
    */

    createNewGame();

    loadPuzzle();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   BUTTON EVENTS
   ========================================= */

nextButton.addEventListener(
    "click",
    showNextPuzzle
);


restartButton.addEventListener(
    "click",
    restartGame
);


/* =========================================
   START GAME
   ========================================= */

createNewGame();

loadPuzzle();