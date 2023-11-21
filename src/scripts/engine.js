const imgPath = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${imgPath}dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${imgPath}magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${imgPath}exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
];

const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.querySelector("#card-image"),
    name: document.getElementById("card-name"),
    type: document.querySelector("#card-type"),
  },
  fieldCards: {
    player: document.querySelector("#player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSides: {
    player1: "player-cards",
    playerBox: document.getElementById("player-cards"),
    computer: "computer-cards",
    computerBox: document.querySelector("#computer-cards"),
  },
  actions: { button: document.querySelector("#next-duel") },
};

async function getRandomCardId() {
  return Math.floor(Math.random() * cardData.length);
}

async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.src = `${imgPath}card-back.png`;
  cardImage.setAttribute("data-id", idCard);
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener("mouseover", () => drawSelectCard(idCard));
    cardImage.addEventListener("click", () => setCardsField(idCard));
  }

  return cardImage;
}

async function setCardsField(cardId) {
  await removeAllCardsImages();
  const computerCardId = await getRandomCardId();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";
  state.actions.button.style.visibility = "visible";

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  const duelResult = await checkDuel(cardId, computerCardId);

  await updatedScore();
  await drawButton(duelResult);
}
 
async function drawButton(text) {
  state.actions.button.innerText = text.toUpperCase();
}

async function updatedScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} ⚔ Lose: ${state.score.computerScore}`;
}

async function checkDuel(playerCardId, computerCardId) {
  let duelResult = "draw";
  const playerCard = cardData[playerCardId];

  if (playerCard.winOf.includes(computerCardId)) {
    duelResult = "win";
    state.score.playerScore++;
  } else if (playerCard.loseOf.includes(computerCardId)) {
    duelResult = "lose";
    state.score.computerScore++;
  }

  if (duelResult !== "draw") {
    await playAudio(duelResult);
  }

  return duelResult;
}

async function removeAllCardsImages() {
  const { playerBox, computerBox } = state.playerSides;
  [playerBox, computerBox].forEach((box) => {
    box.querySelectorAll("img").forEach((element) => element.remove());
  });
}

async function drawSelectCard(index) {
  const selectedCard = cardData[index];
  state.cardSprites.avatar.src = selectedCard.img;
  state.cardSprites.name.innerText = selectedCard.name;
  state.cardSprites.type.innerText = "Attribute: " + selectedCard.type;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);
    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.visibility = "hidden";
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";
  initialize();
}

async function playAudio(state) {
  const audio = new Audio(`./src/assets/audios/${state}.wav`);
  audio.play();
}

function initialize() {
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";
  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.computer);

  let audio = document.getElementById("bgm")
  audio.volume = 0.2
  audio.play()
}

initialize();
