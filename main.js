//WORDLE
// list of variables
let data = [];
const numOfGuesses = 6;
let remainingGuesses = numOfGuesses;
let currentGuess = [];
let nextLetter = 0;
let wordToGuess = "";

//fetching elements from JSON file
async function getDataFromFile(file) {
  try {
    const res = await fetch(file);
    if (res.ok) {
      return res.json();
    } else {
      console.error("Error! The JSON file has not loaded properly.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching the JSON file:", error);
    return [];
  }
}

//game board
async function createBoard() {
  const data = await getDataFromFile("./wordle.json");
  wordToGuess = data[Math.floor(Math.random() * data.length)];
  console.log(wordToGuess);

  const board = document.getElementById("gameGrid");
  board.innerHTML = "";

  for (let i = 0; i < numOfGuesses; i++) {
    let row = document.createElement("div");
    row.className = "rowLetter";
    for (let j = 0; j < 5; j++) {
      let box = document.createElement("div");
      box.className = "boxLetter";
      row.appendChild(box);
    }
    board.appendChild(row);
  }
}
createBoard();

//user input
document.addEventListener("keyup", (event) => {
  if (remainingGuesses === 0) return;

  const keyPressed = event.key.toLowerCase();
  if (keyPressed === "backspace" && nextLetter > 0) {
    deleteLetter();
  } else if (keyPressed === "enter") {
    guessChecking();
  } else if (/^[a-z]$/.test(keyPressed)) {
    insertLetter(keyPressed);
  }
});

//onscreen keyboard input
document.getElementById("gameKeyboard").addEventListener("click", (e) => {
  const target = e.target;

  if (!target.classList.contains("keyboardButton")) {
    return;
  }
  let key = target.textContent;

  if (key === "Del") {
    key = "Backspace";
  }

  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});

//inserting letters
function insertLetter(keyPressed) {
  if (nextLetter < 5) {
    const row =
      document.getElementsByClassName("rowLetter")[
        numOfGuesses - remainingGuesses
      ];
    const box = row.children[nextLetter];
    box.textContent = keyPressed;
    box.classList.add("boxFilled");
    currentGuess.push(keyPressed);
    nextLetter++;
  }
}

//deleting letters
function deleteLetter() {
  if (nextLetter > 0) {
    nextLetter--;
    const row =
      document.getElementsByClassName("rowLetter")[
        numOfGuesses - remainingGuesses
      ];
    const box = row.children[nextLetter];
    box.textContent = "";
    box.classList.remove("boxFilled");
    currentGuess.pop();
  }
}

//checking letters + feedback
function guessChecking() {
  const row =
    document.getElementsByClassName("rowLetter")[
      numOfGuesses - remainingGuesses
    ];
  const guessString = currentGuess.join("");
  const rightGuess = Array.from(wordToGuess);

  if (guessString.length !== 5) {
    alert("The word must have five letters!");
    return;
  }

  for (let i = 0; i < 5; i++) {
    const box = row.children[i];
    const letter = currentGuess[i];
    let color;

    if (rightGuess[i] === letter) {
      color = "green";
      rightGuess[i] = null;
    } else if (rightGuess.includes(letter)) {
      color = "yellow";
      rightGuess[rightGuess.indexOf(letter)] = null;
    } else {
      color = "grey";
    }

    box.style.backgroundColor = color;
  }

  if (guessString === wordToGuess) {
    if (
      confirm(
        "Congratulations! You guessed it right! Would you like to play again?"
      )
    ) {
      resetGame();
    } else {
      remainingGuesses = 0;
    }
  } else {
    remainingGuesses--;
    currentGuess = [];
    nextLetter = 0;
    if (remainingGuesses === 0) {
      if (
        confirm(
          `Tough luck, you ran out of guesses! The correct word was ${wordToGuess}. Would you like to play again?`
        )
      ) {
        resetGame();
      }
    }
  }
}

function resetGame() {
  remainingGuesses = numOfGuesses;
  currentGuess = [];
  nextLetter = 0;
  createBoard();
}
