export function removeAccent(str) {
    return str.replaceAll(/[éêè]/gi, "e").replaceAll(/à/gi, "a")

}

export function getRandomWord(list) {
    return list[Math.floor(Math.random() * list.length)];
};

export function generateGrid(word) {
    const grid = document.querySelector(".grid");
    const gridWidth = word.length;
    // Réinitialisation du contenu de la grille
    grid.innerHTML = "";

    // Création de chaque rangée
    for (let j = 0; j < 6; j++) {
        const row = document.createElement("div");
        row.classList.add("row");

        // Création de chaque tuile pour chaque rangée
        for (let i = 0; i < gridWidth; i++) {
            const tile = document.createElement("div");
            const span = document.createElement("span");
            tile.classList.add("tile");
            tile.appendChild(span);
            row.appendChild(tile);

        };
        // Ajout de la rangée à la grille
        grid.appendChild(row);
    };
};

export function showHint(word, row, hint) {
    const rows = document.querySelectorAll(".row");
    const spans = rows[row].querySelectorAll("span");
    //Affiche le contenu de hint dans chaque tuile
    for (let i = 0; i < word.length; i++) {
        spans[i].textContent = hint[i]
    }

};

export function updateRow(word, row, userWord, hint) {
    if (userWord.length === word.length) {
        const rows = document.querySelectorAll(".row");
        const span = rows[row].querySelectorAll("span");

        userWord = [...userWord.toLowerCase()];
        for (let i = 0; i < userWord.length; i++) {
            span[i].textContent = userWord[i]
        }

        compareWords(word, row, hint)
    }
}

export function compareWords(wordToFind, row, hint) {
    const rows = document.querySelectorAll(".row");
    const span = rows[row].querySelectorAll("span");

    for (let i = 0; i < wordToFind.length; i++) {
        if (wordToFind.includes(span[i].textContent)) {
            if (wordToFind[i] === span[i].textContent) {
                span[i].parentNode.classList.add("good-place");
                hint[i] = wordToFind[i]
            } else {
                span[i].parentNode.classList.add("wrong-place");
            }
        }
    }
}

export function checkWin(word, userWord) {
    const result = document.querySelector(".result");
    let gameOver;
    if (word === userWord.toLowerCase()) {
        gameOver = true;
    }
    return gameOver;
}