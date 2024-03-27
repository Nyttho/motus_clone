export function removeAccent(str) {
    return str.replaceAll(/[éêè]/gi, "e").replaceAll("à", "a").replaceAll("â", "a").replaceAll("ç", "c").replaceAll("ô", "o").replaceAll("û", "u");
}

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

    const wordToFindOccurrences = {}; // Objets pour compter les occurrences dans le mot mystère
    const wordOccurrences = {}; // Objets pour compter les occurrences dans le mot utilisateur

    // Compter les occurrences dans le mot mystère
    for (const letter of wordToFind) {
        wordToFindOccurrences[letter] = (wordToFindOccurrences[letter] || 0) + 1;
    }

    // Compter les occurrences dans le mot utilisateur et vérifier les lettres à la bonne place
    for (let i = 0; i < wordToFind.length; i++) {
        const letter = span[i].textContent;
        if (letter === wordToFind[i]) {
            span[i].parentNode.classList.add("good-place");
            hint[i] = letter;
            // Décrémenter les occurrences pour éviter de les compter deux fois
            wordToFindOccurrences[letter]--;
            wordOccurrences[letter] = (wordOccurrences[letter] || 0) + 1;
        }
    }

    // Vérifier les lettres restantes dans le mot utilisateur
    for (let i = 0; i < wordToFind.length; i++) {
        const letter = span[i].textContent;
        if (letter !== wordToFind[i] && wordToFind.includes(letter)) {
            if (wordToFindOccurrences[letter] > 0) {
                span[i].parentNode.classList.add("wrong-place");
                // Décrémenter les occurrences pour éviter de les compter deux fois
                wordToFindOccurrences[letter]--;
                wordOccurrences[letter] = (wordOccurrences[letter] || 0) + 1;
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

// Fonction pour effectuer la recherche sur le site Larousse
export async function searchWordOnLarousse(word) {
    // URL de recherche sur Larousse
    const url = `https://www.larousse.fr/dictionnaires/francais/${word}`;

    try {
        const response = await fetch(url);

        // Vérifier si la réponse est réussie (statut 200)
        if (response.ok) {
            // Analyser le contenu HTML de la page
            const html = await response.text();

            // Vérifier si le mot existe dans la réponse HTML
            if (html.includes("Définitions")) {
                return true;
            } else {
                return false;
            }
        } else {
            throw new Error('Erreur lors de la requête HTTP vers Larousse.');
        }
    } catch (error) {
        return `Une erreur s'est produite : ${error.message}`;
    }
}

