// ==========================================
// CAMPO MINADO - PROGRAMAÇÃO WEB (GAC116)
// Desenvolvido em JavaScript Puro (Vanilla JS)
// ==========================================

// Configurações do Tabuleiro (Tamanho Fixo Padrão)
const ROWS = 10;
const COLS = 10;
const TOTAL_MINES = 15;
const TOTAL_SAFE_CELLS = (ROWS * COLS) - TOTAL_MINES; // 85 células seguras

// Elementos do DOM
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultModal = document.getElementById('result-modal');

const btnStart = document.getElementById('btn-start');
const btnRestartGame = document.getElementById('btn-restart-game');
const btnModalRestart = document.getElementById('btn-modal-restart');

const boardElement = document.getElementById('board');
const minesCountElement = document.getElementById('mines-count');
const flagsCountElement = document.getElementById('flags-count');
const timerDisplay = document.getElementById('timer-display');

const resultImage = document.getElementById('result-image');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const resultTime = document.getElementById('result-time');

// Estado do Jogo
let board = [];
let gameState = 'START'; // 'START', 'PLAYING', 'WON', 'LOST'
let revealedCount = 0;
let flagsCount = 0;
let secondsElapsed = 0;
let timerInterval = null;
let isFirstClick = true;

// ==========================================
// INICIALIZAÇÃO E EVENTOS GLOBAIS
// ==========================================

function init() {
    btnStart.addEventListener('click', startGame);
    btnRestartGame.addEventListener('click', restartGame);
    btnModalRestart.addEventListener('click', restartGame);

    // Prevenir menu de contexto do botão direito em todo o jogo
    boardElement.addEventListener('contextmenu', (e) => e.preventDefault());
}

// ==========================================
// CONTROLE DO ESTADO DE JOGO
// ==========================================

function startGame() {
    gameState = 'PLAYING';
    revealedCount = 0;
    flagsCount = 0;
    secondsElapsed = 0;
    isFirstClick = true;

    // Atualizar HUD inicial
    minesCountElement.textContent = TOTAL_MINES;
    flagsCountElement.textContent = 0;
    timerDisplay.textContent = '00:00';

    // Parar cronômetro se estivesse rodando
    stopTimer();
    startTimer();

    // Alternar telas e esconder modal
    startScreen.classList.remove('active');
    gameScreen.classList.add('active');
    resultModal.classList.remove('active');
    resultImage.classList.add('hidden');

    // Inicializar lógica do tabuleiro
    createBoard();
    placeMines();
    calculateAdjacentMines();
    renderBoard();
}

function restartGame() {
    startGame();
}

function gameOver(isWin, hitRow = -1, hitCol = -1) {
    gameState = isWin ? 'WON' : 'LOST';
    stopTimer();

    // Se perdeu, revelar todas as minas no tabuleiro com o GIF/imagem de bomba
    if (!isWin) {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = board[r][c];
                const element = cell.element;

                if (cell.isMine) {
                    element.classList.add('revealed', 'mine-revealed');
                    element.innerHTML = '<img src="bomb-joypixels.webp" class="mine-icon" alt="💣">';
                }
            }
        }

        // Destacar a mina específica que explodiu
        if (hitRow !== -1 && hitCol !== -1) {
            board[hitRow][hitCol].element.classList.add('mine-exploded');
        }
    }

    // Configurar mensagem e imagem do modal
    const formattedTime = formatTime(secondsElapsed);
    resultTime.textContent = formattedTime;

    if (isWin) {
        resultImage.classList.add('hidden');
        resultTitle.textContent = '🏆 VOCÊ VENCEU!';
        resultTitle.className = 'result-title win';
        resultMessage.textContent = 'Parabéns! Você encontrou todas as células seguras sem explodir.';
    } else {
        resultImage.src = 'bomb-joypixels.webp';
        resultImage.classList.remove('hidden');
        resultTitle.textContent = '💥 GAME OVER!';
        resultTitle.className = 'result-title lose';
        resultMessage.textContent = 'Você clicou em uma mina e a partida terminou.';
    }

    // Exibir modal após pequeno delay para suavidade
    setTimeout(() => {
        resultModal.classList.add('active');
    }, 400);
}

// ==========================================
// CRONÔMETRO
// ==========================================

function startTimer() {
    timerInterval = setInterval(() => {
        secondsElapsed++;
        timerDisplay.textContent = formatTime(secondsElapsed);
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const minStr = String(minutes).padStart(2, '0');
    const secStr = String(seconds).padStart(2, '0');
    return `${minStr}:${secStr}`;
}

// ==========================================
// CRIAÇÃO E CONFIGURAÇÃO DO TABULEIRO
// ==========================================

function createBoard() {
    board = [];
    for (let r = 0; r < ROWS; r++) {
        const row = [];
        for (let c = 0; c < COLS; c++) {
            row.push({
                row: r,
                col: c,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0,
                element: null
            });
        }
        board.push(row);
    }
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < TOTAL_MINES) {
        const r = Math.floor(Math.random() * ROWS);
        const c = Math.floor(Math.random() * COLS);

        if (!board[r][c].isMine) {
            board[r][c].isMine = true;
            minesPlaced++;
        }
    }
}

function calculateAdjacentMines() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c].isMine) continue;

            let count = 0;
            // Verificar as 8 células vizinhas
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = r + dr;
                    const nc = c + dc;

                    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                        if (board[nr][nc].isMine) {
                            count++;
                        }
                    }
                }
            }
            board[r][c].adjacentMines = count;
        }
    }
}

function renderBoard() {
    boardElement.innerHTML = '';

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = board[r][c];
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            
            cellElement.dataset.row = r;
            cellElement.dataset.col = c;
            cell.element = cellElement;

            // Eventos de clique
            cellElement.addEventListener('click', () => handleCellClick(r, c));
            cellElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleFlag(r, c);
            });

            boardElement.appendChild(cellElement);
        }
    }
}

// ==========================================
// INTERAÇÃO E JOGABILIDADE
// ==========================================

function handleCellClick(r, c) {
    if (gameState !== 'PLAYING') return;

    const cell = board[r][c];

    // Se estiver marcada com bandeira ou já revelada, ignorar
    if (cell.isFlagged || cell.isRevealed) return;

    // Garantir que o primeiro clique nunca seja uma mina
    if (isFirstClick) {
        isFirstClick = false;
        if (cell.isMine) {
            relocateMine(r, c);
        }
    }

    // Se clicou numa mina -> Derrota
    if (cell.isMine) {
        gameOver(false, r, c);
        return;
    }

    // Revelar célula
    revealCell(r, c);

    // Verificar se venceu a partida
    checkWin();
}

function relocateMine(row, col) {
    board[row][col].isMine = false;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (!board[r][c].isMine && (r !== row || c !== col)) {
                board[r][c].isMine = true;
                calculateAdjacentMines();
                return;
            }
        }
    }
}

function revealCell(r, c) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;

    const cell = board[r][c];

    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;
    revealedCount++;

    const element = cell.element;
    element.classList.add('revealed');

    if (cell.adjacentMines > 0) {
        element.textContent = cell.adjacentMines;
        element.dataset.count = cell.adjacentMines;
    } else {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr !== 0 || dc !== 0) {
                    revealCell(r + dr, c + dc);
                }
            }
        }
    }
}

function toggleFlag(r, c) {
    if (gameState !== 'PLAYING') return;

    const cell = board[r][c];

    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    const element = cell.element;

    if (cell.isFlagged) {
        element.textContent = '🚩';
        flagsCount++;
    } else {
        element.textContent = '';
        flagsCount--;
    }

    flagsCountElement.textContent = flagsCount;
}

function checkWin() {
    if (revealedCount === TOTAL_SAFE_CELLS) {
        gameOver(true);
    }
}

// Iniciar escutadores quando a página for carregada
window.addEventListener('load', init);
