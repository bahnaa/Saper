// import bombsGenerator from "./bombsGenerator.js";
// export {mineFields, BOMBS, CEILS_NUMBER};

const fields = document.querySelector(".fields");

const mineFields = document.querySelectorAll(".mine-field");
const BOMBS = 10;
const CEILS_NUMBER = 64;
const data = {};

fields.addEventListener("click", checkIfBomb);
fields.addEventListener("contextmenu", removeDefaultBehaviour);
fields.addEventListener("contextmenu", rightClickHandler);

function bombsGenerator() {
  const bombsPlacement = [];

  for (let i = 0; i < BOMBS; i++) {
    const newBombCeil = Math.floor(Math.random() * CEILS_NUMBER);

    const indexOfRepeatedBomb = bombsPlacement.findIndex(
      (existingBomb) => existingBomb == newBombCeil
    );

    if (indexOfRepeatedBomb != -1) {
      bombsPlacement.splice(indexOfRepeatedBomb, 1);
      i--;
    }
    bombsPlacement.push(newBombCeil);

    mineFields[newBombCeil].dataset.name = "bomb";
  }
}

function checkIfBomb(e) {
  // starts timer on the start of the game

  if (
    Array.from(mineFields).filter((field) => field.innerText !== "").length ===
    0
  ) {
    countTime();
  }

  // what happens after loosing (clicking on the field with bomb)

  if (e.target.dataset.name === "bomb") {
    e.target.style.backgroundColor = 'rgb(182, 182, 182)';
    winOrLoseDisableFields("lose");
  } else {
    printBombsAround(e);
  }
}

function printBombsAround(e) {
  // preventing container (fields) from dissapearing

  if (e.target.classList.contains("fields")) {
    return;
  }

  let bombCounter = 0;
  const adjacentCeils = [];
  const index = Array.from(mineFields).findIndex((ceil) => ceil === e.target);

  // pushing indexes of adjacent ceils with bombs

  adjacentCeils.push(
    index - Math.sqrt(CEILS_NUMBER) - 1,
    index - Math.sqrt(CEILS_NUMBER),
    index - Math.sqrt(CEILS_NUMBER) + 1,
    index - 1,
    index + 1,
    index + Math.sqrt(CEILS_NUMBER) - 1,
    index + Math.sqrt(CEILS_NUMBER),
    index + Math.sqrt(CEILS_NUMBER) + 1
  );

  // (for the first column) deleting bombs that are on the right side of the board

  if (index % Math.sqrt(CEILS_NUMBER) === 0) {
    adjacentCeils.splice(0, 1);
    adjacentCeils.splice(2, 1);
    adjacentCeils.splice(3, 1);
  }

  // (for the last column) deleting bombs that are on the right side of the board

  if ((index + 1) % Math.sqrt(CEILS_NUMBER) === 0) {
    adjacentCeils.splice(2, 1);
    adjacentCeils.splice(3, 1);
    adjacentCeils.splice(5, 1);
  }

  // counting adjacent bombs for the certain ceil

  adjacentCeils.forEach((index) => {
    if (
      mineFields[index] != undefined &&
      mineFields[index].dataset.name === "bomb"
    ) {
      bombCounter++;
    }
  });
  // console.log(bombCounter);
  e.target.innerText = bombCounter;
  checkIfWin();
}

function removeDefaultBehaviour(e) {
  e.preventDefault();
}

// (handling right click) predicting the bomb placement

function rightClickHandler(e) {
  let counter = 0;
  for (const field of mineFields) {
    if (field.classList.contains("checked")) {
      counter++;
    }
  }
  if (counter === BOMBS) {
    if (e.target.classList.contains("checked")) {
      e.target.classList.remove("checked");
      counter--;
      changeLeftBombsNumber();
      return;
    } else {
      return;
    }
  }
  e.target.classList.toggle("checked");
  changeLeftBombsNumber();
}

// starting timer after first left click

function countTime() {
  let time = 0;
  const timer = document.querySelector(".timer");
  const timerId = setInterval(() => {
    time++;
    timer.innerText =
      time % 60 < 10
        ? `${Math.floor(time / 60)}:0${time % 60}`
        : `${Math.floor(time / 60)}:${time % 60}`;
  }, 1000);
  data.timerId = timerId;
}

// showing current number of bombs that are left

function changeLeftBombsNumber() {
  const bombsCounter = document.querySelector(".bombs-counter");
  let bombsLeft = 0;
  mineFields.forEach((field) => {
    if (field.classList.contains("checked")) {
      bombsLeft++;
    }
  });
  bombsCounter.innerText = BOMBS - bombsLeft;
}

function checkIfWin() {
  let uncoveredFields = 0;
  mineFields.forEach((field) => {
    if (field.innerText !== "") {
      uncoveredFields++;
    }
  });

  // what happens after winning

  if (uncoveredFields === CEILS_NUMBER - BOMBS) {
    winOrLoseDisableFields("win");
  }
}

function winOrLoseDisableFields(result) {
  const emoji = document.querySelector(".emoji");
  if (result === "lose") {
    emoji.classList.replace("emoji-neutral", "emoji-sad");
  } else {
    emoji.classList.replace("emoji-neutral", "emoji-happy");
  }
  clearInterval(data.timerId);
  showBombs();
  fields.removeEventListener("click", checkIfBomb);
  fields.removeEventListener("contextmenu", rightClickHandler);
  mineFields.forEach(field => {
    field.classList.remove("mine-field-enabled");
  })
  emoji.addEventListener("click", () => {
    window.location.reload();
  });
}

function showBombs() {
  for (const field of mineFields) {
    if (field.dataset.name === "bomb") {
      field.classList.add("uncovered");
    }
  }
}

bombsGenerator();
