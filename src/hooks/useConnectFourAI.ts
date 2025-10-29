import { COLS, ROWS } from "../styles/variables/constans";
import { Board, Cell, Player } from "./useConnectFour";

export type Difficulty = 'easy' | 'medium' | 'hard';

export function getAIMove(board: Board, player: Player, difficulty: Difficulty = 'medium'): number {
    const validMoves = getValidMoves(board);
    if (validMoves.length === 0) return -1;

    switch (difficulty) {
        case 'easy':
            return getRandomMove(validMoves);
        case 'medium':
            return getMediumMove(board, player, validMoves);
        case 'hard':
            return getHardMoveAdvanced(board, player, validMoves);
        default:
            return validMoves[0];
    }
}

// Легкий уровень - рандом
function getRandomMove(validMoves: number[]): number {
    return validMoves[Math.floor(Math.random() * validMoves.length)];
}

// Средний уровень - эвристический
function getMediumMove(board: Board, player: Player, validMoves: number[]): number {
    const opponent: Player = player === 'onePlayer' ? 'twoPlayer' : 'onePlayer';

    for (const col of validMoves) {
        if (isWinningMove(board, player, col)) return col;
    }

    for (const col of validMoves) {
        if (isWinningMove(board, opponent, col)) return col;
    }

    for (const col of validMoves) {
        const newBoard = makeMove(board, player, col);
        if (countThreats(newBoard, player) > countThreats(board, player)) {
            return col;
        }
    }

    const centerMoves = validMoves.filter(col => col >= 2 && col <= 4);
    if (centerMoves.length > 0) {
        return centerMoves[Math.floor(Math.random() * centerMoves.length)];
    }

    return validMoves[0];
}


// Сложный уровень - Эвристический алгоритм с приоритетной оценкой позиций
function getHardMoveAdvanced(board: Board, player: Player, validMoves: number[]): number {
    const opponent: Player = player === 'onePlayer' ? 'twoPlayer' : 'onePlayer';

    for (const col of validMoves) {
        if (isWinningMove(board, player, col)) {
            return col;
        }
    }

    for (const col of validMoves) {
        if (isWinningMove(board, opponent, col)) {
            return col;
        }
    }

    const safeMoves = validMoves.filter(col => {
        const testBoard = makeMove(board, player, col);
        const row = getDropRow(board, col);
        
        if (row > 0) {
            const aboveBoard = makeMove(testBoard, opponent, col);
            if (checkBoardWinner(aboveBoard) === opponent) {
                return false;
            }
        }
        return true;
    });

    const movesToConsider = safeMoves.length > 0 ? safeMoves : validMoves;

    let bestScore = -Infinity;
    let bestMoves: number[] = [];

    for (const col of movesToConsider) {
        const score = evaluateMoveComprehensive(board, player, col);
        
        if (score > bestScore) {
            bestScore = score;
            bestMoves = [col];
        } else if (score === bestScore) {
            bestMoves.push(col);
        }
    }

    if (bestMoves.length > 1) {
        bestMoves.sort((a, b) => Math.abs(3 - a) - Math.abs(3 - b));
    }

    return bestMoves[0];
}

// Комплексная оценка хода
function evaluateMoveComprehensive(board: Board, player: Player, col: number): number {
    const newBoard = makeMove(board, player, col);
    const opponent: Player = player === 'onePlayer' ? 'twoPlayer' : 'onePlayer';
    
    let score = 0;

    score += evaluateBoardAdvanced(newBoard, player);

    const myThreats = countThreats(newBoard, player);
    const oppThreats = countThreats(newBoard, opponent);
    score += myThreats * 50;
    score -= oppThreats * 40;

    const row = getDropRow(board, col);
    if (col === 3) score += 20;
    if (col === 2 || col === 4) score += 10;
    
    const totalMoves = countTotalMoves(board);
    if (totalMoves < 10) {
        score += (ROWS - row) * 3;
    }

    score += countConnections(newBoard, player, row, col) * 8;

    return score;
}

// Оценка доски
function evaluateBoardAdvanced(board: Board, player: Player): number {
    let score = 0;

    const directions = [
        { dr: 0, dc: 1 },  
        { dr: 1, dc: 0 }, 
        { dr: 1, dc: 1 },  
        { dr: 1, dc: -1 },
    ];

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            for (const dir of directions) {
                const window = getWindow(board, row, col, dir.dr, dir.dc);
                if (window.length === 4) {
                    score += scoreWindow(window, player);
                }
            }
        }
    }

    return score;
}

function getWindow(board: Board, startRow: number, startCol: number, dr: number, dc: number): Cell[] {
    const window: Cell[] = [];
    for (let i = 0; i < 4; i++) {
        const r = startRow + i * dr;
        const c = startCol + i * dc;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
            window.push(board[r][c]);
        }
    }
    return window;
}

function scoreWindow(window: Cell[], player: Player): number {
    const opponent: Player = player === 'onePlayer' ? 'twoPlayer' : 'onePlayer';
    
    const playerCount = window.filter(c => c === player).length;
    const opponentCount = window.filter(c => c === opponent).length;
    const emptyCount = window.filter(c => c === null).length;

    if (playerCount > 0 && opponentCount > 0) return 0;

    if (playerCount === 4) return 10000;
    if (playerCount === 3 && emptyCount === 1) return 100;
    if (playerCount === 2 && emptyCount === 2) return 10;
    if (playerCount === 1 && emptyCount === 3) return 1;

    if (opponentCount === 3 && emptyCount === 1) return -150;
    if (opponentCount === 2 && emptyCount === 2) return -10;

    return 0;
}

// Подсчет угроз (троек с возможностью победы)
function countThreats(board: Board, player: Player): number {
    let threats = 0;

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {

            if (col + 3 < COLS) {
                const window = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
                if (isThreatenWindow(window, player)) threats++;
            }

            if (row + 3 < ROWS) {
                const window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
                if (isThreatenWindow(window, player)) threats++;
            }

            if (row + 3 < ROWS && col + 3 < COLS) {
                const window = [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]];
                if (isThreatenWindow(window, player)) threats++;
            }

            if (row + 3 < ROWS && col - 3 >= 0) {
                const window = [board[row][col], board[row + 1][col - 1], board[row + 2][col - 2], board[row + 3][col - 3]];
                if (isThreatenWindow(window, player)) threats++;
            }
        }
    }

    return threats;
}

function isThreatenWindow(window: Cell[], player: Player): boolean {
    const playerCount = window.filter(c => c === player).length;
    const emptyCount = window.filter(c => c === null).length;
    return playerCount === 3 && emptyCount === 1;
}

// Подсчет соединений в позиции
function countConnections(board: Board, player: Player, row: number, col: number): number {
    let connections = 0;
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (const [dr, dc] of directions) {
        for (let dist = 1; dist <= 3; dist++) {
            const r = row + dr * dist;
            const c = col + dc * dist;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
                connections++;
            } else {
                break;
            }
        }
    }

    return connections;
}

function countTotalMoves(board: Board): number {
    let count = 0;
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] !== null) count++;
        }
    }
    return count;
}

function getDropRow(board: Board, col: number): number {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === null) return row;
    }
    return -1;
}

// Вспомогательные функции
function getValidMoves(board: Board): number[] {
    const moves: number[] = [];
    for (let col = 0; col < COLS; col++) {
        if (board[0][col] === null) moves.push(col);
    }
    return moves;
}

function makeMove(board: Board, player: Player, col: number): Board {
    const newBoard = board.map(row => [...row]);
    for (let row = ROWS - 1; row >= 0; row--) {
        if (newBoard[row][col] === null) {
            newBoard[row][col] = player;
            break;
        }
    }
    return newBoard;
}

function isWinningMove(board: Board, player: Player, col: number): boolean {
    const newBoard = makeMove(board, player, col);
    return checkBoardWinner(newBoard) === player;
}

function checkBoardWinner(board: Board): Player | null {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const player = board[row][col];
            if (!player) continue;
            
            if (col + 3 < COLS &&
                player === board[row][col + 1] &&
                player === board[row][col + 2] &&
                player === board[row][col + 3]
            ) return player;
            
            if (row + 3 < ROWS &&
                player === board[row + 1][col] &&
                player === board[row + 2][col] &&
                player === board[row + 3][col]
            ) return player;
            
            if (row + 3 < ROWS && col + 3 < COLS &&
                player === board[row + 1][col + 1] &&
                player === board[row + 2][col + 2] &&
                player === board[row + 3][col + 3]
            ) return player;
            
            if (row + 3 < ROWS && col - 3 >= 0 &&
                player === board[row + 1][col - 1] &&
                player === board[row + 2][col - 2] &&
                player === board[row + 3][col - 3]
            ) return player;
        }
    }
    return null;
}
