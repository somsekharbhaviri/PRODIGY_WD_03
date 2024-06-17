document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const board = document.getElementById("board");
    const message = document.getElementById("message");
    const restartButton = document.getElementById("restart");
    const playerVsPlayerButton = document.getElementById("player-vs-player");
    const playerVsComputerButton = document.getElementById("player-vs-computer");
    const scorePlayer1 = document.getElementById("score-player1");
    const scorePlayer2 = document.getElementById("score-player2");
    const turnIndicator = document.getElementById("turn-indicator");

    let currentPlayer = "X";
    let boardState = Array(9).fill(null);
    let gameMode = "pvp";
    let score = { player1: 0, player2: 0 };

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const startGame = (mode) => {
        gameMode = mode;
        currentPlayer = "X";
        boardState = Array(9).fill(null);
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("disabled", "player-x", "player-o");
        });
        message.classList.add("hidden");
        restartButton.classList.add("hidden");
        board.classList.remove("hidden");
        turnIndicator.classList.remove("hidden");
        turnIndicator.textContent = "Player 1's Turn (X)";
        turnIndicator.style.color = "#007bff";
    };

    const checkWinner = () => {
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                return boardState[a];
            }
        }
        if (boardState.every(cell => cell)) {
            return "Draw";
        }
        return null;
    };

    const handleClick = (index) => {
        if (boardState[index] || checkWinner()) return;

        boardState[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        cells[index].classList.add(currentPlayer === "X" ? "player-x" : "player-o");
        cells[index].classList.add("disabled");

        const winner = checkWinner();
        if (winner) {
            endGame(winner);
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            turnIndicator.textContent = `Player ${currentPlayer === "X" ? "1's" : "2's"} Turn (${currentPlayer})`;
            turnIndicator.style.color = currentPlayer === "X" ? "#007bff" : "#dc3545";
            if (gameMode === "pvc" && currentPlayer === "O") {
                computerMove();
            }
        }
    };

    const computerMove = () => {
        let availableMoves = boardState.map((cell, index) => cell ? null : index).filter(cell => cell !== null);
        let move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        handleClick(move);
    };

    const endGame = (winner) => {
        if (winner === "Draw") {
            message.textContent = "It's a draw!";
        } else {
            message.textContent = `Player ${winner} wins!`;
            if (winner === "X") {
                score.player1++;
                scorePlayer1.textContent = `Player 1: ${score.player1}`;
            } else {
                score.player2++;
                scorePlayer2.textContent = `Player 2: ${score.player2}`;
            }
        }
        message.classList.remove("hidden");
        restartButton.classList.remove("hidden");
        board.classList.add("hidden");
        turnIndicator.classList.add("hidden");
    };

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => handleClick(index));
    });

    restartButton.addEventListener("click", () => startGame(gameMode));
    playerVsPlayerButton.addEventListener("click", () => startGame("pvp"));
    playerVsComputerButton.addEventListener("click", () => startGame("pvc"));
});
