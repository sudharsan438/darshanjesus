/* =========================================
   DARSHAN DAILY LUCK
   ========================================= */

const drawButton =
    document.getElementById("draw-button");

const newDayButton =
    document.getElementById("new-day-button");

const drawInstruction =
    document.getElementById("draw-instruction");

const cardContainer =
    document.getElementById("card-container");

const luckResult =
    document.getElementById("luck-result");

const resultSymbol =
    document.getElementById("result-symbol");

const resultTitle =
    document.getElementById("result-title");

const resultMessage =
    document.getElementById("result-message");

const resultEnergy =
    document.getElementById("result-energy");

const resultLuck =
    document.getElementById("result-luck");

const resultFocus =
    document.getElementById("result-focus");


/* =========================================
   DAILY CARDS
   ========================================= */

const cards = [

    {
        name: "The Angel",
        symbol: "✦",
        type: "GUIDANCE",
        energy: "Peace",
        luck: "★★★★☆",
        focus: "Trust",
        message:
            "A quiet moment may bring you the clarity you have been looking for. Listen carefully to your inner voice and allow patience to guide your next step."
    },

    {
        name: "The Sun",
        symbol: "☀",
        type: "POSITIVITY",
        energy: "Joy",
        luck: "★★★★★",
        focus: "Confidence",
        message:
            "Today invites you to step into the light. Share your ideas, appreciate what is already going well, and let your confidence guide you forward."
    },

    {
        name: "The Moon",
        symbol: "☾",
        type: "INTUITION",
        energy: "Reflection",
        luck: "★★★☆☆",
        focus: "Awareness",
        message:
            "Not everything needs an immediate answer. Give yourself time to observe, reflect and understand what you are truly feeling."
    },

    {
        name: "The Star",
        symbol: "★",
        type: "HOPE",
        energy: "Inspiration",
        luck: "★★★★☆",
        focus: "Dreams",
        message:
            "Keep your attention on what you hope to create. A small step taken today can become meaningful progress over time."
    },

    {
        name: "The Phoenix",
        symbol: "🔥",
        type: "RENEWAL",
        energy: "Courage",
        luck: "★★★★☆",
        focus: "Change",
        message:
            "Something old may be ready to make room for something new. Don't be afraid of change when it helps you grow."
    },

    {
        name: "The Guardian",
        symbol: "♜",
        type: "STRENGTH",
        energy: "Protection",
        luck: "★★★★☆",
        focus: "Discipline",
        message:
            "Stand firmly by what matters to you. Calm discipline today can protect the progress you have already made."
    },

    {
        name: "The Shadow",
        symbol: "☽",
        type: "REFLECTION",
        energy: "Awareness",
        luck: "★★★☆☆",
        focus: "Honesty",
        message:
            "Every person has things they would rather avoid. Facing one small truth today can give you greater freedom tomorrow."
    },

    {
        name: "The Flame",
        symbol: "♨",
        type: "MOTIVATION",
        energy: "Drive",
        luck: "★★★★☆",
        focus: "Action",
        message:
            "Your energy becomes powerful when it is directed toward something meaningful. Choose one important thing and give it your full attention."
    },

    {
        name: "The Heart",
        symbol: "♥",
        type: "CONNECTION",
        energy: "Warmth",
        luck: "★★★★★",
        focus: "Relationships",
        message:
            "A kind word or thoughtful action can mean more than you realize. Give attention to the people who bring meaning to your life."
    },

    {
        name: "The Wanderer",
        symbol: "✧",
        type: "DISCOVERY",
        energy: "Curiosity",
        luck: "★★★☆☆",
        focus: "Learning",
        message:
            "Be open to something unfamiliar today. A new idea, place or conversation may teach you something unexpected."
    },

    {
        name: "The Crown",
        symbol: "♕",
        type: "ACHIEVEMENT",
        energy: "Confidence",
        luck: "★★★★★",
        focus: "Leadership",
        message:
            "Take responsibility for the direction you want your life to move. Confidence grows when you act with purpose."
    },

    {
        name: "The Seed",
        symbol: "✿",
        type: "GROWTH",
        energy: "Potential",
        luck: "★★★★☆",
        focus: "Patience",
        message:
            "Not every result appears immediately. Give your efforts time to grow and continue nurturing what matters."
    }

];


/* =========================================
   STATE
   ========================================= */

let availableCards = [];

let selectedCard = null;

let cardsDrawn = false;

let resultShown = false;


/* =========================================
   SHUFFLE
   ========================================= */

function shuffle(array) {

    const shuffled =
        [...array];

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
   DRAW THREE CARDS
   ========================================= */

function drawCards() {

    if (cardsDrawn) return;

    cardsDrawn = true;

    drawButton.disabled = true;

    drawButton.textContent =
        "CHOOSE ONE CARD";

    drawInstruction.textContent =
        "Trust your instinct and choose one.";


    availableCards =
        shuffle(cards).slice(0, 3);


    cardContainer.innerHTML = "";


    availableCards.forEach(
        (card, index) => {

            const cardElement =
                createCard(
                    card,
                    index
                );

            cardContainer.appendChild(
                cardElement
            );

        }
    );


    /*
       Small entrance animation.
    */

    const cardElements =
        document.querySelectorAll(
            ".luck-card"
        );


    cardElements.forEach(
        (card, index) => {

            card.style.opacity = "0";

            card.style.transform =
                "translateY(30px)";


            setTimeout(() => {

                card.style.transition =
                    "opacity 0.5s ease, transform 0.5s ease";

                card.style.opacity = "1";

                card.style.transform =
                    "translateY(0)";

            }, index * 180);

        }
    );
}


/* =========================================
   CREATE CARD
   ========================================= */

function createCard(cardData, index) {

    const button =
        document.createElement("button");

    button.type = "button";

    button.className =
        "luck-card";

    button.setAttribute(
        "aria-label",
        `Choose card ${index + 1}`
    );


    const inner =
        document.createElement("span");

    inner.className =
        "luck-card-inner";


    /* FRONT */

    const front =
        document.createElement("span");

    front.className =
        "luck-card-front";


    const number =
        document.createElement("span");

    number.className =
        "card-number";

    number.textContent =
        `CARD ${index + 1}`;


    front.appendChild(number);


    /* BACK */

    const back =
        document.createElement("span");

    back.className =
        "luck-card-back";


    const symbol =
        document.createElement("span");

    symbol.className =
        "luck-symbol";

    symbol.textContent =
        cardData.symbol;


    const title =
        document.createElement("strong");

    title.className =
        "luck-card-title";

    title.textContent =
        cardData.name;


    const type =
        document.createElement("span");

    type.className =
        "luck-card-type";

    type.textContent =
        cardData.type;


    back.appendChild(symbol);

    back.appendChild(title);

    back.appendChild(type);


    inner.appendChild(front);

    inner.appendChild(back);

    button.appendChild(inner);


    button.addEventListener(
        "click",
        () => chooseCard(
            button,
            cardData
        )
    );


    return button;
}


/* =========================================
   CHOOSE CARD
   ========================================= */

function chooseCard(
    selectedElement,
    cardData
) {

    if (resultShown) return;

    if (selectedCard) return;


    selectedCard = cardData;


    const allCards =
        document.querySelectorAll(
            ".luck-card"
        );


    /*
       Disable all cards after selection.
    */

    allCards.forEach(card => {

        card.classList.add(
            "disabled"
        );

    });


    /*
       Highlight selected card.
    */

    selectedElement.classList.add(
        "selected"
    );


    /*
       Flip chosen card.
    */

    setTimeout(() => {

        selectedElement.classList.add(
            "flipped"
        );

    }, 150);


    /*
       Other cards gently fade.
    */

    allCards.forEach(card => {

        if (card !== selectedElement) {

            card.style.opacity =
                "0.35";

            card.style.transform =
                "scale(0.96)";
        }

    });


    drawInstruction.textContent =
        "Your card has been revealed.";


    drawButton.style.display =
        "none";


    /*
       Show result after the
       card has time to flip.
    */

    setTimeout(() => {

        showResult(cardData);

    }, 950);
}


/* =========================================
   SHOW RESULT
   ========================================= */

function showResult(cardData) {

    resultShown = true;


    resultSymbol.textContent =
        cardData.symbol;


    resultTitle.textContent =
        cardData.name;


    resultMessage.textContent =
        cardData.message;


    resultEnergy.textContent =
        cardData.energy;


    resultLuck.textContent =
        cardData.luck;


    resultFocus.textContent =
        cardData.focus;


    luckResult.hidden =
        false;


    luckResult.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/* =========================================
   NEW DAILY DRAW
   ========================================= */

function resetGame() {

    selectedCard = null;

    cardsDrawn = false;

    resultShown = false;


    availableCards = [];


    luckResult.hidden =
        true;


    cardContainer.innerHTML =
        "";


    drawButton.disabled =
        false;

    drawButton.style.display =
        "inline-block";

    drawButton.textContent =
        "DRAW TODAY'S CARDS";


    drawInstruction.textContent =
        "When the cards appear, choose one.";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   BUTTON EVENTS
   ========================================= */

drawButton.addEventListener(
    "click",
    drawCards
);


newDayButton.addEventListener(
    "click",
    resetGame
);


/* =========================================
   INITIAL STATE
   ========================================= */

luckResult.hidden =
    true;