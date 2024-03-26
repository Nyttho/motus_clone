import { removeAccent, generateGrid, showHint, updateRow, checkWin, searchWordOnLarousse } from "./modules/module.js";

let gameOver = false;
const input = document.querySelector(".user-answer");
const nextWordBtn = document.querySelector(".next-word");
const result = document.querySelector(".result");
const scoreDisplay = document.querySelector(".score");
const numberOfGameDisplay = document.querySelector(".nb-of-game");
const wordLength = document.querySelector(".word-length");
const errorMsg = document.querySelector(".error-msg")
let rowNb = 0;
let wordAlreadyUsed = [];
let score = 0;
let numberOfGame = 0;

let wordToFind = "";

let hint;

async function fetchWord(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const words = await response.json();
        const word = words[0].name;

        if (word.length < 8) {
            return word;
        } else {
            return fetchWord(url);
        }
    } catch (error) {
        console.error('Error fetching word:', error);
        throw error;
    }
}

async function handleKeyDown(e) {
    errorMsg.textContent = "";
    const userAnswer = input.value;

    if (e.key !== "Enter") return;

    const userWordExists = await searchWordOnLarousse(userAnswer);

    if (!userWordExists) {
        input.value = "";
        errorMsg.textContent = "Ce mot n'existe pas dans le dictionnaire";
        return;
    }

    if (userAnswer.length !== wordToFind.length) {
        errorMsg.textContent = "Veuillez taper un mot de " + wordToFind.length + " lettres"
        return;
    }

    updateRow(wordToFind, rowNb, userAnswer, hint);
    if (rowNb < 5) {
        rowNb++;
    } else {
        gameOver = true;
        endGame();
        return;
    }

    gameOver = checkWin(wordToFind, userAnswer);
    if (gameOver) {
        endGame();
        return;
    }

    showHint(wordToFind, rowNb, hint);

    input.value = "";
}

async function newGame() {

    nextWordBtn.style.display = "none";
    result.textContent = "";
    gameOver = false;
    rowNb = 0;
    numberOfGame++;

    numberOfGameDisplay.textContent = numberOfGame;
    nextWordBtn.removeEventListener("click", newGame);

    do {
        wordToFind = await fetchWord("https://trouve-mot.fr/api/sizemin/5");
    } while (wordAlreadyUsed.includes(wordToFind));
    wordToFind = removeAccent(wordToFind);
    wordLength.textContent = wordToFind.length;
    wordAlreadyUsed.push(wordToFind);
    console.log(wordToFind);
    hint = [...wordToFind[0] + ".".repeat(wordToFind.length - 1)]
    generateGrid(wordToFind);
    showHint(wordToFind, rowNb, hint);
    input.addEventListener("keydown", handleKeyDown);

}

function endGame() {
    input.value = "";
    if (hint.join("").toLowerCase() === wordToFind) {
        result.textContent = "Gagné !";
        result.style.color = "green";
        score++;
        scoreDisplay.textContent = score;
    } else {
        result.textContent = "Perdu ! le mot était : " + wordToFind;
        result.style.color = "red";
    }
    input.removeEventListener("keydown", handleKeyDown);
    nextWordBtn.style.display = "inline-block";
    nextWordBtn.addEventListener("click", newGame);
}

newGame();














