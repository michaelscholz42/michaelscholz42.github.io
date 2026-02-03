// Valentine's Wordle Game
const WORD_LIST = [
    "SWEET",
    "HEART",
    "ADORE",
    "CUPID",
    "ROSES",
    "LOVER",
    "BLUSH",
    "SMILE",
    "ANGEL",
    "DREAM",
    "FLAME",
    "GIDDY",
    "LOVED",
    "MAGIC",
    "SWOON",
    "TRUST",
    "WORTH",
    
];

let word = "";
let row = 1;
let currentGuess = "";
let gameOver = false;
let gameWon = false;
let usedLetters = new Set();
let collection = [];
let maxLetters = 5;
const maxRows = 6;

// Initialize game board
function initializeBoard() {
    const gameBoard = document.getElementById("gameBoard");
    gameBoard.innerHTML = "";
    
    for (let i = 0; i < maxRows; i++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "row";
        
        for (let j = 0; j < maxLetters; j++) {
            const box = document.createElement("div");
            box.className = "box";
            rowDiv.appendChild(box);
            collection.push(box);
        }
        
        gameBoard.appendChild(rowDiv);
    }
}

// Generate random word from word list
function generateWord() {
    word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    console.log("Word generated:", word);
}

// Check the guess
function checkGuess() {
    let usedLettersCount = {};
    
    // Count letters in the word
    for (let letter of word) {
        usedLettersCount[letter] = (usedLettersCount[letter] || 0) + 1;
    }

    let startIdx = (row - 1) * maxLetters;
    
    // First pass: Mark exact matches (green)
    for (let i = 0; i < maxLetters; i++) {
        let box = collection[startIdx + i];
        if (currentGuess[i] === word[i]) {
            box.classList.add("correct");
            usedLettersCount[currentGuess[i]]--;
        }
    }

    // Second pass: Mark misplaced letters (yellow) and absent letters (gray)
    for (let i = 0; i < maxLetters; i++) {
        let box = collection[startIdx + i];
        let letter = currentGuess[i];
        
        if (!box.classList.contains("correct")) {
            if (word.includes(letter) && usedLettersCount[letter] > 0) {
                box.classList.add("present");
                usedLettersCount[letter]--;
            } else {
                box.classList.add("absent");
            }
        }
    }
    
    usedLetters.add(...currentGuess);
}

// Update display
function updateDisplay() {
    let startIdx = (row - 1) * maxLetters;
    for (let i = 0; i < maxLetters; i++) {
        collection[startIdx + i].textContent = currentGuess[i] || "";
    }
}

// Handle a guess submission
function handleGuess() {
    if (gameOver) return;
    if (currentGuess.length !== maxLetters) {
        showAlert("❤️ Word must be 5 letters!");
        return;
    }

    if (!WORD_LIST.includes(currentGuess)) {
        showAlert("💔 Not a valid word! Try again.");
        return;
    }

    checkGuess();

    if (currentGuess === word) {
        gameWon = true;
        gameOver = true;
        setTimeout(() => {
            showWinModal();
        }, 500);
        return;
    }

    row++;
    if (row > maxRows) {
        gameOver = true;
        setTimeout(() => {
            showAlert(`💔 Game Over! The word was: ${word}`);
        }, 500);
        return;
    }

    currentGuess = "";
}

// Reset game
function resetGame() {
    gameOver = false;
    gameWon = false;
    collection.forEach(box => {
        box.textContent = "";
        box.className = "box";
    });
    word = "";
    row = 1;
    currentGuess = "";
    usedLetters.clear();
    generateWord();
}

// Show alert message
function showAlert(message) {
    alert(message);
}

// Show win modal
function showWinModal() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Correct!</h2>
            <p class="message">Correct! Will you be my valentine? 💕</p>
            <div style="text-align:center; margin-top: 15px;">
                <button id="yesButton" class="special-key">Yes 💕</button>
                <button id="laterButton" class="key">Maybe Later</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = "block";

    const closeBtn = modal.querySelector(".close");
    const yesBtn = modal.querySelector("#yesButton");
    const laterBtn = modal.querySelector("#laterButton");

    closeBtn.onclick = () => modal.remove();
    laterBtn.onclick = () => modal.remove();

    yesBtn.onclick = () => {
        const msg = modal.querySelector(".message");
        msg.textContent = "Yay! 💖 She said yes!";
        msg.classList.add("win");
        yesBtn.disabled = true;
        laterBtn.disabled = true;
        setTimeout(() => modal.remove(), 1800);
    };

    window.onclick = (event) => {
        if (event.target === modal) modal.remove();
    };
}

// Show settings/how to play
function showHowToPlay() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>💕 How to Play 💕</h2>
            <p><strong>Welcome to Valentine's Wordle!</strong></p>
            <p>🎯 <strong>Goal:</strong> Guess the 5-letter love word in 6 tries.</p>
            <p><strong>How it works:</strong></p>
            <ul style="text-align: left;">
                <li>💚 <strong>Green:</strong> Letter is correct and in the right position</li>
                <li>💛 <strong>Yellow:</strong> Letter is in the word but wrong position</li>
                <li>⚫ <strong>Gray:</strong> Letter is not in the word</li>
            </ul>
            <p><strong>Tips:</strong></p>
            <ul style="text-align: left;">
                <li>Think of love, romance, and Valentine's Day words!</li>
                <li>Start with common letters</li>
                <li>Use each hint to narrow down the word</li>
            </ul>
            <p style="font-size: 1.2em; margin-top: 20px;">Happy guessing! 💕</p>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = "block";

    const closeBtn = modal.querySelector(".close");
    closeBtn.onclick = () => modal.remove();
    window.onclick = (event) => {
        if (event.target === modal) modal.remove();
    };
}

// Main initialization
async function main() {
    initializeBoard();
    generateWord();

    // Button event listeners
    document.getElementById("resetButton").addEventListener('click', resetGame);
    document.getElementById("settingsButton").addEventListener('click', showHowToPlay);

    // Keyboard buttons
    document.querySelectorAll('.key').forEach(button => {
        button.addEventListener('click', function() {
            if (gameOver || currentGuess.length >= maxLetters) return;
            currentGuess += button.textContent;
            updateDisplay();
        });
    });

    // Backspace button
    document.getElementById("backspace").addEventListener("click", function() {
        if (gameOver) return;
        currentGuess = currentGuess.slice(0, -1);
        updateDisplay();
    });

    // Enter button
    document.getElementById("enter").addEventListener("click", handleGuess);

    // Keyboard support
    document.addEventListener("keydown", function(event) {
        if (gameOver) return;

        if (/^[a-zA-Z]$/.test(event.key) && currentGuess.length < maxLetters) {
            currentGuess += event.key.toUpperCase();
            updateDisplay();
        } else if (event.key === "Backspace") {
            currentGuess = currentGuess.slice(0, -1);
            updateDisplay();
        } else if (event.key === "Enter") {
            handleGuess();
        }
    });
}

// Start the game when DOM is loaded
document.addEventListener("DOMContentLoaded", main);
