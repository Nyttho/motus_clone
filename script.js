import { removeAccent, getRandomWord, compareWords, generateGrid, showHint, updateRow, checkWin } from "./modules/module.js";

const wordList = [
    "bureau",
    "ballon",
    "chanson",
    "voiture",
    "citron",
    "montage",
    "ananas",
    "stylo",
    "machine",
    "oiseau",
    "bateau",
    "papier",
    "poisson",
    "livre",
    "banane",
    "chambre",
    "ordinateur",
    "nuage",
    "jouet",
    "lunette",
    "girafe",
    "crayon",
    "clavier",
    "magasin",
    "cheval",
    "tortue",
    "sourire",
    "vampire",
    "biscuit",
    "bagage",
    "jardin",
    "bracelet",
    "chapeau",
    "école",
    "téléphone",
    "orange",
    "canard",
    "chien",
    "écharpe",
    "football",
    "maison",
    "guitare",
    "escalier",
    "soleil",
    "plante",
    "fleur",
    "montre",
    "tableau",
    "journal",
    "alligator",
    "chocolat",
    "sandwich",
    "abeille",
    "arc-en-ciel",
    "ciseaux",
    "cerveau",
    "pomme",
    "fraise",
    "gâteau",
    "marteau",
    "mouton",
    "perroquet",
    "crocodile",
    "hibou",
    "piano",
    "voiture",
    "avion",
    "navire",
    "étagère",
    "fenêtre",
    "cuisine",
    "coccinelle",
    "escalator",
    "girouette",
    "ordinateur",
    "ventilateur",
    "parachute",
    "radiateur",
    "stylo",
    "crocodile",
    "éléphant",
    "hibou",
    "grenouille",
    "cheval",
    "panier",
    "bateau",
    "bagage",
    "avion",
    "télévision",
    "lumière",
    "vampire",
    "papier",
    "ordinateur",
    "sandwich",
    "marteau",
    "piano",
    "alligator",
    "pomme",
    "cerveau"
];





let gameOver = false;
const input = document.querySelector(".user-answer");
const nextWordBtn = document.querySelector(".next-word");
const result = document.querySelector(".result");
const scoreDisplay = document.querySelector(".score");
const numberOfGameDisplay = document.querySelector(".nb-of-game");
const wordLength = document.querySelector(".word-length")
let rowNb = 0;
let wordAlreadyUsed = [];
let score = 0;
let numberOfGame = 0;

let wordToFind = "";

let hint;

function handleKeyDown(e) {
    const userAnswer = input.value;
    if (e.key === "Enter") {
        if (!gameOver) {
            if (rowNb < 5) {
                if (userAnswer.length === wordToFind.length) {
                    updateRow(wordToFind, rowNb, userAnswer, hint);
                    rowNb++;
                    // Vérifie si le joueur a gagné après avoir mis à jour la ligne
                    gameOver = checkWin(wordToFind, userAnswer);
                    if (gameOver) {
                        endGame();
                        return; // Arrête la fonction ici pour ne pas exécuter les actions suivantes
                    }
                    showHint(wordToFind, rowNb, hint);
                } else {
                    rowNb++;
                    showHint(wordToFind, rowNb, hint);
                }
                input.value = "";
            } else {
                gameOver = true;
                endGame();
            }
        }
    }
}

function newGame() {

    nextWordBtn.style.display = "none";
    result.textContent = "";
    gameOver = false;
    rowNb = 0;
    numberOfGame++;

    numberOfGameDisplay.textContent = numberOfGame;
    nextWordBtn.removeEventListener("click", newGame);

    do {
        wordToFind = removeAccent(getRandomWord(wordList))
    } while (wordAlreadyUsed.includes(wordToFind));
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
    if (hint.join("") === wordToFind) {
        result.textContent = "Gagné !";
        result.style.color = "green";
        score++;
        scoreDisplay.textContent = score;
    } else {
        result.textContent = "Perdu !";
        result.style.color = "red";
    }
    input.removeEventListener("keydown", handleKeyDown);
    nextWordBtn.style.display = "inline-block";
    nextWordBtn.addEventListener("click", newGame);
}

newGame();














