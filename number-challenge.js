/* =========================================================
   DARSHAN MIND LAB — NUMBER CHALLENGE V1
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    const modeButtons = document.querySelectorAll(".challenge-mode");
    const difficultyButtons = document.querySelectorAll(".difficulty-button");

    const scoreEl = document.getElementById("score");
    const streakEl = document.getElementById("streak");
    const timerEl = document.getElementById("timer");

    const questionLabelEl = document.getElementById("question-label");
    const questionEl = document.getElementById("question");
    const questionHintEl = document.getElementById("question-hint");

    const answerGrid = document.getElementById("answer-grid");
    const answerButtons = document.querySelectorAll(".answer-button");

    const gameMessageEl = document.getElementById("game-message");

    const startButton = document.getElementById("start-button");
    const nextButton = document.getElementById("next-button");


    /* =====================================================
       GAME SETTINGS
    ===================================================== */

    const TOTAL_QUESTIONS = 10;

    const DIFFICULTY_SETTINGS = {
        easy: {
            time: 15,
            points: 100
        },

        medium: {
            time: 12,
            points: 150
        },

        hard: {
            time: 10,
            points: 200
        }
    };


    /* =====================================================
       GAME STATE
    ===================================================== */

    let selectedMode = "sequence";
    let selectedDifficulty = "easy";

    let score = 0;
    let streak = 0;

    let currentQuestion = 0;
    let correctAnswer = null;

    let gameRunning = false;
    let questionAnswered = false;

    let timerInterval = null;
    let timeLeft = 0;


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    setActiveMode("sequence");
    setActiveDifficulty("easy");

    updateStats();
    resetAnswerButtons();

    gameMessageEl.textContent =
        "Choose a challenge and difficulty, then start the game.";


    /* =====================================================
       MODE SELECTION
    ===================================================== */

    modeButtons.forEach((button) => {

        button.addEventListener("click", () => {

            if (gameRunning) {
                return;
            }

            const mode = button.dataset.mode;

            if (!mode) {
                return;
            }

            selectedMode = mode;

            setActiveMode(mode);

            updateReadyMessage();
        });

    });


    /* =====================================================
       DIFFICULTY SELECTION
    ===================================================== */

    difficultyButtons.forEach((button) => {

        button.addEventListener("click", () => {

            if (gameRunning) {
                return;
            }

            const difficulty = button.dataset.difficulty;

            if (!difficulty) {
                return;
            }

            selectedDifficulty = difficulty;

            setActiveDifficulty(difficulty);

            updateReadyMessage();
        });

    });


    /* =====================================================
       START BUTTON
    ===================================================== */

    startButton.addEventListener("click", () => {

        if (gameRunning) {
            return;
        }

        startGame();

    });


    /* =====================================================
       NEXT BUTTON
    ===================================================== */

    nextButton.addEventListener("click", () => {

        if (!gameRunning) {
            return;
        }

        if (!questionAnswered) {
            return;
        }

        loadNextQuestion();

    });


    /* =====================================================
       ANSWER BUTTONS
    ===================================================== */

    answerButtons.forEach((button) => {

        button.addEventListener("click", () => {

            if (!gameRunning) {
                return;
            }

            if (questionAnswered) {
                return;
            }

            if (button.disabled) {
                return;
            }

            const selectedAnswer = Number(button.dataset.answer);

            checkAnswer(selectedAnswer, button);

        });

    });


    /* =====================================================
       START GAME
    ===================================================== */

    function startGame() {

        clearTimer();

        score = 0;
        streak = 0;
        currentQuestion = 0;

        gameRunning = true;
        questionAnswered = false;

        startButton.disabled = true;
        startButton.textContent = "CHALLENGE RUNNING";

        nextButton.disabled = true;

        setModeButtonsDisabled(true);
        setDifficultyButtonsDisabled(true);

        updateStats();

        loadQuestion();

    }


    /* =====================================================
       LOAD QUESTION
    ===================================================== */

    function loadQuestion() {

        clearTimer();

        questionAnswered = false;

        nextButton.disabled = true;

        resetAnswerButtons();

        currentQuestion++;

        const question = createQuestion(
            selectedMode,
            selectedDifficulty
        );

        correctAnswer = question.answer;

        questionLabelEl.textContent =
            `Question ${currentQuestion} of ${TOTAL_QUESTIONS}`;

        questionEl.textContent = question.question;

        questionHintEl.textContent = question.hint;

        setAnswerOptions(question.options);

        gameMessageEl.textContent =
            "Choose your answer.";

        startTimer();

    }


    /* =====================================================
       LOAD NEXT QUESTION
    ===================================================== */

    function loadNextQuestion() {

        if (currentQuestion >= TOTAL_QUESTIONS) {
            finishGame();
            return;
        }

        loadQuestion();

    }


    /* =====================================================
       CREATE QUESTION
    ===================================================== */

    function createQuestion(mode, difficulty) {

        if (mode === "sequence") {
            return createSequenceQuestion(difficulty);
        }

        if (mode === "missing") {
            return createMissingNumberQuestion(difficulty);
        }

        if (mode === "calculation") {
            return createCalculationQuestion(difficulty);
        }

        return createSequenceQuestion(difficulty);

    }


    /* =====================================================
       NUMBER SEQUENCE
    ===================================================== */

  function createSequenceQuestion(difficulty) {

    let sequence = [];
    let answer;
    let question;

    /* =========================
       EASY
       Simple addition
    ========================== */

    if (difficulty === "easy") {

        const start = randomInt(2, 12);
        const step = randomInt(2, 5);

        for (let i = 0; i < 4; i++) {
            sequence.push(start + step * i);
        }

        answer = sequence[3] + step;

        question =
            `${sequence[0]}  →  ${sequence[1]}  →  ${sequence[2]}  →  ${sequence[3]}  →  ?`;

    }


    /* =========================
       MEDIUM
       Multiplication pattern
    ========================== */

    else if (difficulty === "medium") {

        const start = randomInt(2, 5);
        const multiplier = randomInt(2, 3);

        sequence.push(start);

        for (let i = 1; i < 4; i++) {
            sequence.push(sequence[i - 1] * multiplier);
        }

        answer = sequence[3] * multiplier;

        question =
            `${sequence[0]}  →  ${sequence[1]}  →  ${sequence[2]}  →  ${sequence[3]}  →  ?`;

    }


    /* =========================
       HARD
       Multiply + addition pattern
    ========================== */

    else {

        const start = randomInt(2, 6);
        const multiplier = 2;
        const addition = randomInt(1, 4);

        sequence.push(start);

        for (let i = 1; i < 4; i++) {

            sequence.push(
                sequence[i - 1] * multiplier + addition
            );

        }

        answer =
            sequence[3] * multiplier + addition;

        question =
            `${sequence[0]}  →  ${sequence[1]}  →  ${sequence[2]}  →  ${sequence[3]}  →  ?`;

    }


    const options =
        createOptions(answer, difficulty);

    return {
        question,
        answer,
        options,
        hint: "Find the pattern and choose the next number."
    };

}

    /* =====================================================
       MISSING NUMBER
    ===================================================== */

   function createMissingNumberQuestion(difficulty) {

    let sequence = [];
    let answer;
    let missingIndex;
    let question;


    /* =========================
       EASY
       Simple addition
    ========================== */

    if (difficulty === "easy") {

        const start = randomInt(2, 12);
        const step = randomInt(2, 5);

        for (let i = 0; i < 5; i++) {
            sequence.push(start + step * i);
        }

    }


    /* =========================
       MEDIUM
       Multiplication pattern
    ========================== */

    else if (difficulty === "medium") {

        const start = randomInt(2, 4);
        const multiplier = 2;

        sequence.push(start);

        for (let i = 1; i < 5; i++) {
            sequence.push(sequence[i - 1] * multiplier);
        }

    }


    /* =========================
       HARD
       Multiply + addition
    ========================== */

    else {

        const start = randomInt(2, 5);
        const multiplier = 2;
        const addition = randomInt(1, 3);

        sequence.push(start);

        for (let i = 1; i < 5; i++) {

            sequence.push(
                sequence[i - 1] * multiplier + addition
            );

        }

    }


    missingIndex = randomInt(1, 3);

    answer = sequence[missingIndex];

    const displaySequence =
        sequence.map((number, index) => {

            if (index === missingIndex) {
                return "?";
            }

            return number;

        });

    question =
        displaySequence.join("   ");

    const options =
        createOptions(answer, difficulty);

    return {
        question,
        answer,
        options,
        hint: "Find the number that completes the pattern."
    };

}


    /* =====================================================
       QUICK CALCULATION
    ===================================================== */

    function createCalculationQuestion(difficulty) {

        let a;
        let b;
        let c;

        let answer;
        let question;

        if (difficulty === "easy") {

            a = randomInt(5, 30);
            b = randomInt(2, 20);

            if (Math.random() < 0.5) {

                answer = a + b;

                question = `${a} + ${b} = ?`;

            } else {

                const larger = Math.max(a, b);
                const smaller = Math.min(a, b);

                answer = larger - smaller;

                question = `${larger} − ${smaller} = ?`;

            }

        } else if (difficulty === "medium") {

            a = randomInt(5, 30);
            b = randomInt(2, 12);

            if (Math.random() < 0.5) {

                answer = a * b;

                question = `${a} × ${b} = ?`;

            } else {

                answer = a + b * 2;

                question = `${a} + ${b} × 2 = ?`;

            }

        } else {

            a = randomInt(4, 20);
            b = randomInt(2, 10);
            c = randomInt(2, 12);

            const type = randomInt(1, 3);

            if (type === 1) {

                answer = a * b + c;

                question =
                    `${a} × ${b} + ${c} = ?`;

            } else if (type === 2) {

                answer = a + b * c;

                question =
                    `${a} + ${b} × ${c} = ?`;

            } else {

                answer = a * b - c;

                question =
                    `${a} × ${b} − ${c} = ?`;

            }

        }

        const options = createOptions(answer, difficulty);

        return {
            question,
            answer,
            options,
            hint: "Solve the calculation as quickly as you can."
        };

    }


    /* =====================================================
       CREATE ANSWER OPTIONS
    ===================================================== */

    function createOptions(answer, difficulty) {

        const options = [answer];

        let spread;

        if (difficulty === "easy") {
            spread = Math.max(3, Math.round(Math.abs(answer) * 0.15));
        } else if (difficulty === "medium") {
            spread = Math.max(5, Math.round(Math.abs(answer) * 0.2));
        } else {
            spread = Math.max(7, Math.round(Math.abs(answer) * 0.25));
        }

        let attempts = 0;

        while (options.length < 4 && attempts < 100) {

            attempts++;

            const variation = randomInt(
                Math.max(1, Math.floor(spread / 2)),
                Math.max(2, spread)
            );

            const direction =
                Math.random() < 0.5 ? -1 : 1;

            const candidate =
                answer + variation * direction;

            if (
                candidate >= 0 &&
                !options.includes(candidate)
            ) {
                options.push(candidate);
            }

        }

        while (options.length < 4) {

            const candidate =
                Math.max(
                    0,
                    answer + options.length * 3
                );

            if (!options.includes(candidate)) {
                options.push(candidate);
            }

        }

        shuffle(options);

        return options;

    }


    /* =====================================================
       SET ANSWER OPTIONS
    ===================================================== */

    function setAnswerOptions(options) {

        answerButtons.forEach((button, index) => {

            const value = options[index];

            button.disabled = false;
            button.classList.remove("correct", "wrong");

            button.dataset.answer = value;
            button.textContent = value;

        });

    }


    /* =====================================================
       CHECK ANSWER
    ===================================================== */

    function checkAnswer(selectedAnswer, selectedButton) {

        questionAnswered = true;

        clearTimer();

        answerButtons.forEach((button) => {
            button.disabled = true;
        });

        if (selectedAnswer === correctAnswer) {

            streak++;

            const settings =
                DIFFICULTY_SETTINGS[selectedDifficulty];

            const streakBonus =
                Math.max(0, (streak - 1) * 25);

            const speedBonus =
                Math.max(0, timeLeft * 5);

            const earnedPoints =
                settings.points +
                streakBonus +
                speedBonus;

            score += earnedPoints;

            selectedButton.classList.add("correct");

            gameMessageEl.textContent =
                `Correct! +${earnedPoints} points`;

        } else {

            streak = 0;

            selectedButton.classList.add("wrong");

            answerButtons.forEach((button) => {

                if (
                    Number(button.dataset.answer) ===
                    correctAnswer
                ) {
                    button.classList.add("correct");
                }

            });

            gameMessageEl.textContent =
                `Not quite. The correct answer is ${correctAnswer}.`;

        }

        updateStats();

        nextButton.disabled = false;

        if (currentQuestion >= TOTAL_QUESTIONS) {
            nextButton.textContent = "SEE RESULTS";
        } else {
            nextButton.textContent = "NEXT";
        }

    }


    /* =====================================================
       TIMER
    ===================================================== */

    function startTimer() {

        const settings =
            DIFFICULTY_SETTINGS[selectedDifficulty];

        timeLeft = settings.time;

        updateTimer();

        timerInterval = setInterval(() => {

            timeLeft--;

            updateTimer();

            if (timeLeft <= 0) {

                clearTimer();

                handleTimeUp();

            }

        }, 1000);

    }


    function updateTimer() {

        timerEl.textContent =
            `${Math.max(0, timeLeft)}s`;

    }


    function handleTimeUp() {

        if (questionAnswered) {
            return;
        }

        questionAnswered = true;

        streak = 0;

        answerButtons.forEach((button) => {
            button.disabled = true;
        });

        answerButtons.forEach((button) => {

            if (
                Number(button.dataset.answer) ===
                correctAnswer
            ) {
                button.classList.add("correct");
            }

        });

        gameMessageEl.textContent =
            `Time's up! The correct answer is ${correctAnswer}.`;

        updateStats();

        nextButton.disabled = false;

        if (currentQuestion >= TOTAL_QUESTIONS) {
            nextButton.textContent = "SEE RESULTS";
        } else {
            nextButton.textContent = "NEXT";
        }

    }


    function clearTimer() {

        if (timerInterval !== null) {

            clearInterval(timerInterval);

            timerInterval = null;

        }

    }


    /* =====================================================
       FINISH GAME
    ===================================================== */

    function finishGame() {

        clearTimer();

        gameRunning = false;
        questionAnswered = true;

        startButton.disabled = false;
        startButton.textContent = "PLAY AGAIN";

        nextButton.disabled = true;
        nextButton.textContent = "NEXT";

        setModeButtonsDisabled(false);
        setDifficultyButtonsDisabled(false);

        questionLabelEl.textContent =
            "Challenge Complete";

        questionEl.textContent =
            score;

        questionHintEl.textContent =
            getResultMessage();

        answerButtons.forEach((button) => {
            button.disabled = true;
            button.classList.remove("correct", "wrong");
            button.textContent = "—";
            delete button.dataset.answer;
        });

        gameMessageEl.textContent =
            `You scored ${score} points across ${TOTAL_QUESTIONS} questions.`;

        timerEl.textContent = "—";

    }


    /* =====================================================
       RESULT MESSAGE
    ===================================================== */

    function getResultMessage() {

        if (score >= 3000) {
            return "Outstanding! Your number skills are impressive.";
        }

        if (score >= 2200) {
            return "Excellent work! Your mind was working fast.";
        }

        if (score >= 1400) {
            return "Great challenge! Keep building your streak.";
        }

        return "Good start! Play again and try to beat your score.";

    }


    /* =====================================================
       UI HELPERS
    ===================================================== */

    function setActiveMode(mode) {

        modeButtons.forEach((button) => {

            button.classList.toggle(
                "active",
                button.dataset.mode === mode
            );

        });

    }


    function setActiveDifficulty(difficulty) {

        difficultyButtons.forEach((button) => {

            button.classList.toggle(
                "active",
                button.dataset.difficulty === difficulty
            );

        });

    }


    function setModeButtonsDisabled(disabled) {

        modeButtons.forEach((button) => {
            button.disabled = disabled;
        });

    }


    function setDifficultyButtonsDisabled(disabled) {

        difficultyButtons.forEach((button) => {
            button.disabled = disabled;
        });

    }


    function updateStats() {

        scoreEl.textContent = score;
        streakEl.textContent = streak;

    }


    function updateReadyMessage() {

        const modeNames = {
            sequence: "Number Sequence",
            missing: "Missing Number",
            calculation: "Quick Calculation"
        };

        const difficultyNames = {
            easy: "Easy",
            medium: "Medium",
            hard: "Hard"
        };

        questionLabelEl.textContent =
            `${modeNames[selectedMode]} • ${difficultyNames[selectedDifficulty]}`;

        questionEl.textContent = "Ready?";

        questionHintEl.textContent =
            "Press START CHALLENGE when you're ready.";

        gameMessageEl.textContent =
            `${modeNames[selectedMode]} selected.`;

    }


    function resetAnswerButtons() {

        answerButtons.forEach((button) => {

            button.disabled = true;
            button.textContent = "—";

            button.classList.remove(
                "correct",
                "wrong"
            );

            delete button.dataset.answer;

        });

    }


    /* =====================================================
       RANDOM HELPERS
    ===================================================== */

    function randomInt(min, max) {

        return Math.floor(
            Math.random() * (max - min + 1)
        ) + min;

    }


    function shuffle(array) {

        for (let i = array.length - 1; i > 0; i--) {

            const j =
                Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] =
                [array[j], array[i]];

        }

        return array;

    }

})();