
const suit = ["♠", "♣", "♥", "♦"];
const value = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const cardValue = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 11,
    "Q": 12,
    "K": 13,
    "A": 14
};
const fullDeck = freshDeck();


let player1Hand = [];
let player2Hand = [];

const startingDeck = document.querySelector('.startingDeck');
startingDeck.addEventListener("click", takeTurn);
startingDeck.addEventListener("click", removeStartingDeck);

const player2Deck = document.querySelector('.player2-deck');
const player1Deck = document.querySelector('.player1-deck');
player2Deck.addEventListener("click", takeTurn);
player1Deck.addEventListener("click", takeTurn);

invisible();


function takeTurn(){

    visible();
    updateScores();
    removeTieEffect();
    
    if (player1Hand.length > 0 && player2Hand.length > 0) {
        let pileCards = [];
        let currentCard1 = player1Hand.shift();
        let currentCard2 = player2Hand.shift();
        let player1CardSlot = document.querySelector('.player1-card-slot');
        let player2CardSlot = document.querySelector('.player2-card-slot');
        setCardInCardSlot(player1CardSlot, player2CardSlot, currentCard1, currentCard2)
        let value1 = cardValue[currentCard1.value];
        let value2 = cardValue[currentCard2.value];

        if (value1 > value2) {
            player1Hand.push(currentCard1, currentCard2);
        } else if (value1 < value2) {
            player2Hand.push(currentCard1, currentCard2);
        } else {
            tie(player1Hand, player2Hand, currentCard1, currentCard2, value1, value2, pileCards);
        }
        console.log("player1", player1Hand.length, player1Hand);
        console.log("player2", player2Hand.length, player2Hand);
        winGame(player1Hand, player2Hand);
    } else {
        winGame(player1Hand, player2Hand);
    }
}

function Card(suit, value) {
    return {
        suit: suit,
        value: value
    };
}

function freshDeck() {
    const deck = [];
    suit.forEach(suit => {
        value.forEach(value => {
            deck.push(new Card(suit, value)); 
        });
    });
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const newIndex = Math.floor(Math.random() * (i + 1));
        const oldValue = deck[newIndex];
        deck[newIndex] = deck[i];
        deck[i] = oldValue;
    }
    return deck;
}

function giveCards(deck, player1Hand, player2Hand){
    const halfDeck = Math.ceil(deck.length / 2);
    player1Hand.push(...deck.slice(0, halfDeck))
    player2Hand.push(...deck.slice(halfDeck, deck.length));
}

function invisible(){
    player1Deck.style.visibility = 'hidden';
    player2Deck.style.visibility = 'hidden';
}
function visible(){
    player1Deck.style.visibility = 'visible';
    player2Deck.style.visibility = 'visible';
}



function playGame() {
    shuffleDeck(fullDeck);
    giveCards(fullDeck, player1Hand, player2Hand);  
}

playGame();

function tie(player1Hand, player2Hand, currentCard1, currentCard2, value1, value2, pileCards){
    tieEffect();
    appendPileEffectOnPlayerSlot();
    if(player1Hand.length <= 4){ 
        console.log("player 2 wins");
        return;
    }
    if(player2Hand.length <= 4){
        console.log("player 1 wins");
        return;
    }
    pileCards.push(currentCard1, currentCard2);
    pileCards.push(...player1Hand.splice(0, 3));
    pileCards.push(...player2Hand.splice(0, 3));
    currentCard1 = player1Hand.shift();
    currentCard2 = player1Hand.shift();
    value1 = cardValue[currentCard1.value];
    value2 = cardValue[currentCard2.value];
    console.log(pileCards);
    if(value1 > value2){
        player1Hand.push(...pileCards, currentCard1, currentCard2);
    } else if(value1 < value2){
        player2Hand.push(...pileCards, currentCard1, currentCard2);
    } else{
        tie(player1Hand, player2Hand, currentCard1, currentCard2, value1, value2, pileCards);
    }
}

function winGame(player1Hand, player2Hand){
    if(player1Hand.length === 0){
        console.log("player 2 wins");
    } else if(player2Hand.length === 0){
        console.log("player 1 wins");
    }
}

//Visualization

function createCard(card, slot){
    const cardSlot = document.querySelector(`.${slot}`);
    cardSlot.innerHTML = '';
    const cardDiv = document.createElement("div");
    cardDiv.classList.add('card');
    cardDiv.dataset.suit = card.suit;
    cardDiv.dataset.value = card.value;

    createPips(card, cardDiv);
    
    const cornerNumberTop = document.createElement("div");
    cornerNumberTop.classList.add('corner-number', 'top');
    cornerNumberTop.innerHTML = `${card.value}<span>${card.suit}</span>`;
    cardDiv.appendChild(cornerNumberTop);

    const cornerNumberBottom = document.createElement("div");
    cornerNumberBottom.classList.add('corner-number', 'bottom');
    cornerNumberBottom.innerHTML = `${card.value}<span>${card.suit}</span>`;
    cardDiv.appendChild(cornerNumberBottom);

    if (card.suit === '♥' || card.suit === '♦') {
        cardDiv.style.color = 'red';
    }

    cardSlot.appendChild(cardDiv);
}


function setCardInCardSlot(player1CardSlot, player2CardSlot, currentCard1, currentCard2){

    createCard(currentCard1, 'player1-card-slot');
    createCard(currentCard2, 'player2-card-slot');
}


function createPips(card, cardDiv){
    if(card.value === 'A' || card.value === 'J' || card.value === 'Q' || card.value === 'K'){
        numPips = 1;
        const pip = document.createElement("div");
        pip.classList.add('pip');
        pip.textContent = card.suit;
        cardDiv.appendChild(pip);
    } else {
        numPips = parseInt(card.value);
        for (let i = 0; i < numPips; i++) {
    
            const pip = document.createElement("div");
            pip.classList.add('pip');
            pip.textContent = card.suit;
            cardDiv.appendChild(pip)
    }   
}
}

document.querySelector('.refreshbutton button').addEventListener('click', function() {
    location.reload();
});

function updateScores(){
    document.querySelector('.player1Score p').textContent = `P1-Cards: ${player1Hand.length}`;
    document.querySelector('.player2Score p').textContent = `P2-Cards: ${player2Hand.length}`;
}

function tieEffect(){
    const gameTitle = document.querySelector('.game-title');
    gameTitle.textContent = "IT'S WAR TIME";
    gameTitle.classList.add('sparkling');
}

function removeTieEffect(){
    const gameTitle = document.querySelector('.game-title');
    gameTitle.textContent = "WAR GAME";
    gameTitle.classList.remove('sparkling');
}

function removeStartingDeck(){
    const startingDeck = document.querySelector('.startingDeck');
    startingDeck.remove();
}
