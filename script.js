import { removeAccent, generateGrid, showHint, updateRow, checkWin, searchWordOnLarousse } from "./modules/module.js";

//-----------dom-------------------
const input = document.querySelector(".user-answer");
const nextWordBtn = document.querySelector(".next-word");
const result = document.querySelector(".result");
const scoreDisplay = document.querySelector(".score");
const numberOfGameDisplay = document.querySelector(".nb-of-game");
const wordLength = document.querySelector(".word-length");
const errorMsg = document.querySelector(".error-msg");
//-------------game variables----------------
let gameOver = false;
let rowNb = 0;
let wordAlreadyUsed = [];
let score = 0;
let numberOfGame = 0;
let wordToFind = "";
let hint;
//----------timer variables---------------
let startTime;
let timerInterval;
let running = false;
let totalElapsedTime = 0;
let numGames = 0;

async function fetchWord(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const words = await response.json();
        const word = words[0].name;

        if (word.length <= 8) {
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
    const userAnswer = removeAccent(input.value).trim();

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
    startTimer();
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
    stopTimer();
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

function startTimer() {
    if (!running) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000); // Met à jour le chronomètre toutes les secondes
        running = true;
    }
}

function stopTimer() {
    if (running) {
        clearInterval(timerInterval);
        const elapsedTime = Date.now() - startTime;
        totalElapsedTime += elapsedTime;
        numGames++;
        const averageTime = totalElapsedTime / numGames;
        const averageMinutes = Math.floor(averageTime / 60000);
        const averageSeconds = Math.floor((averageTime % 60000) / 1000);
        document.getElementById("average-time").innerText = `${padWithZero(averageMinutes)}:${padWithZero(averageSeconds)}`;
        running = false;
    }
}

function updateTimer() {
    const elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const formattedTime = `${padWithZero(minutes)}:${padWithZero(seconds)}`;
    document.getElementById('timer').innerText = formattedTime;
}

function padWithZero(number) {
    return number < 10 ? '0' + number : number;
}

newGame();














