/* =========================================
   DARSHAN REACTION TEST
   ========================================= */


/* =========================================
   ELEMENTS
   ========================================= */

const reactionArea =
    document.getElementById("reaction-area");

const reactionMessage =
    document.getElementById("reaction-message");

const reactionTimeElement =
    document.getElementById("reaction-time");

const bestTimeElement =
    document.getElementById("best-time");

const attemptsElement =
    document.getElementById("attempts");

const averageTimeElement =
    document.getElementById("average-time");

const startButton =
    document.getElementById("start-button");

const resetButton =
    document.getElementById("reset-button");


/* =========================================
   GAME STATE
   ========================================= */

let gameState = "ready";

/*
   Possible states:

   ready
   waiting
   go
   result
   tooSoon
*/

let startTime = 0;

let waitTimer = null;

let attempts = 0;

let totalReactionTime = 0;

let bestTime = null;


/* =========================================
   RANDOM WAIT
   ========================================= */

function getRandomWaitTime() {

    /*
       Random delay between
       2 and 5 seconds.

       The player cannot predict
       exactly when the signal appears.
    */

    return (
        Math.floor(
            Math.random() * 3000
        ) + 2000
    );

}


/* =========================================
   FORMAT TIME
   ========================================= */

function formatTime(time) {

    if (
        time === null ||
        time === undefined
    ) {

        return "—";

    }

    return Math.round(time);

}


/* =========================================
   START TEST
   ========================================= */

function startTest() {

    /*
       Prevent starting another test
       while one is already running.
    */

    if (
        gameState === "waiting" ||
        gameState === "go"
    ) {

        return;

    }


    /*
       Clear any previous timer.
    */

    if (waitTimer) {

        clearTimeout(
            waitTimer
        );

        waitTimer = null;

    }


    /*
       Reset the visual area.
    */

    reactionArea.className =
        "reaction-area wait";


    reactionMessage.textContent =
        "WAIT...";


    reactionTimeElement.textContent =
        "—";


    gameState = "waiting";


    startButton.disabled = true;


    /*
       Random delay.
    */

    const delay =
        getRandomWaitTime();


    waitTimer =
        setTimeout(
            showGoSignal,
            delay
        );

}


/* =========================================
   SHOW GO SIGNAL
   ========================================= */

function showGoSignal() {

    waitTimer = null;


    /*
       Record the exact moment
       the signal appears.
    */

    startTime =
        performance.now();


    gameState = "go";


    reactionArea.className =
        "reaction-area go";


    reactionMessage.textContent =
        "CLICK!";


    /*
       We don't need the START button
       while waiting for the reaction.
    */

    startButton.disabled = true;

}


/* =========================================
   HANDLE REACTION
   ========================================= */

function handleReaction() {

    /*
       Clicked before the signal.
    */

    if (
        gameState === "waiting"
    ) {

        tooSoon();

        return;

    }


    /*
       Clicked when the signal is active.
    */

    if (
        gameState === "go"
    ) {

        const endTime =
            performance.now();


        const reactionTime =
            endTime - startTime;


        recordResult(
            reactionTime
        );

        return;

    }

}


/* =========================================
   TOO SOON
   ========================================= */

function tooSoon() {

    if (waitTimer) {

        clearTimeout(
            waitTimer
        );

        waitTimer = null;

    }


    gameState =
        "tooSoon";


    reactionArea.className =
        "reaction-area too-soon";


    reactionMessage.textContent =
        "TOO SOON!";


    reactionTimeElement.textContent =
        "—";


    startButton.disabled =
        false;

}


/* =========================================
   RECORD RESULT
   ========================================= */

function recordResult(
    reactionTime
) {

    gameState =
        "result";


    attempts++;


    totalReactionTime +=
        reactionTime;


    /*
       Update best time.
    */

    if (
        bestTime === null ||
        reactionTime < bestTime
    ) {

        bestTime =
            reactionTime;

    }


    /*
       Average.
    */

    const average =
        totalReactionTime /
        attempts;


    /*
       Display result.
    */

    reactionTimeElement.textContent =
        formatTime(
            reactionTime
        );


    bestTimeElement.textContent =
        formatTime(
            bestTime
        );


    attemptsElement.textContent =
        attempts;


    averageTimeElement.textContent =
        formatTime(
            average
        );


    /*
       Message based on performance.
    */

    if (
        reactionTime < 200
    ) {

        reactionMessage.textContent =
            "INCREDIBLE!";

    }

    else if (
        reactionTime < 250
    ) {

        reactionMessage.textContent =
            "EXCELLENT!";

    }

    else if (
        reactionTime < 350
    ) {

        reactionMessage.textContent =
            "VERY GOOD!";

    }

    else if (
        reactionTime < 500
    ) {

        reactionMessage.textContent =
            "GOOD REACTION!";

    }

    else {

        reactionMessage.textContent =
            "KEEP PRACTISING!";

    }


    /*
       Keep the area green.
    */

    reactionArea.className =
        "reaction-area go";


    startButton.disabled =
        false;

}


/* =========================================
   RESET
   ========================================= */

function resetGame() {

    /*
       Cancel pending random timer.
    */

    if (waitTimer) {

        clearTimeout(
            waitTimer
        );

        waitTimer = null;

    }


    /*
       Reset state.
    */

    gameState =
        "ready";


    startTime =
        0;


    attempts =
        0;


    totalReactionTime =
        0;


    bestTime =
        null;


    /*
       Reset display.
    */

    reactionArea.className =
        "reaction-area waiting";


    reactionMessage.textContent =
        "Press START to begin";


    reactionTimeElement.textContent =
        "—";


    bestTimeElement.textContent =
        "—";


    attemptsElement.textContent =
        "0";


    averageTimeElement.textContent =
        "—";


    startButton.disabled =
        false;

}


/* =========================================
   AREA CLICK
   ========================================= */

reactionArea.addEventListener(
    "click",
    handleReaction
);


/* =========================================
   KEYBOARD SUPPORT
   ========================================= */

reactionArea.addEventListener(
    "keydown",
    event => {

        if (
            event.key === " " ||
            event.key === "Enter"
        ) {

            event.preventDefault();

            handleReaction();

        }

    }
);


/* =========================================
   START BUTTON
   ========================================= */

startButton.addEventListener(
    "click",
    event => {

        /*
           Prevent the button click from
           reaching other elements.
        */

        event.stopPropagation();

        startTest();

    }
);


/* =========================================
   RESET BUTTON
   ========================================= */

resetButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        resetGame();

    }
);


/* =========================================
   INITIAL STATE
   ========================================= */

resetGame();