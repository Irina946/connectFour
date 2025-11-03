import type { TBoard, TPlayer, TCell } from './types';
import { COLS, ROWS } from '../styles/variables/constans';
import { checkWinner } from './winnerUtils';

export type TDifficulty = 'easy' | 'medium' | 'hard';

export class ConnectFourAI {
    difficulty: TDifficulty;

    constructor(difficulty: TDifficulty = 'medium') {
        this.difficulty = difficulty;
    }

    setDifficulty(difficulty: TDifficulty) {
        this.difficulty = difficulty;
    }

    getMove(board: TBoard, player: TPlayer): number {
        const validMoves = this.getValidMoves(board);
        if (validMoves.length === 0) return -1;
        switch (this.difficulty) {
            case 'easy':
                return this.getRandomMove(validMoves);
            case 'medium':
                return this.getMediumMove(board, player, validMoves);
            case 'hard':
                return this.getHardMoveAdvanced(board, player, validMoves);
            default:
                return validMoves[0];
        }
    }

    private getRandomMove(validMoves: number[]): number {
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    private getMediumMove(board: TBoard, player: TPlayer, validMoves: number[]): number {
        const opponent: TPlayer = player === 'onePlayer' ? 'twoPlayer' : 'onePlayer';
        for (const col of validMoves) {
            if (this.isWinningMove(board, player, col)) return col;
        }
        for (const col of validMoves) {
            if (this.isWinningMove(board, opponent, col)) return col;
        }
        for (const col of validMoves) {
            const newBoard = this.makeMove(board, player, col);
            if (this.countThreats(newBoard, player) > this.countThreats(board, player)) {
                return col;
            }
        }
        const centerMoves = validMoves.filter(col => col >= 2 && col <= 4);
        if (centerMoves.length > 0) {
            return centerMoves[Math.floor(Math.random() * centerMoves.length)];
        }
        return validMoves[0];
    }

    private getHardMoveAdvanced(board: TBoard, player: TPlayer, validMoves: number[]): number {
        const opponent: TPlayer = player === 'onePlayer' ? 'twoPlayer' : 'onePlayer';
        for (const col of validMoves) {
            if (this.isWinningMove(board, player, col)) return col;
        }
        for (const col of validMoves) {
            if (this.isWinningMove(board, opponent, col)) return col;
        }
        const safeMoves = validMoves.filter(col => {
            const testBoard = this.makeMove(board, player, col);
            const row = this.getDropRow(board, col);
            if (row > 0) {
                const aboveBoard = this.makeMove(testBoard, opponent, col);
                if (checkWinner(aboveBoard).winner === opponent) {
                    return false;
                }
            }
            return true;
        });
        const movesToConsider = safeMoves.length > 0 ? safeMoves : validMoves;
        let bestScore = -Infinity;
        let bestMoves: number[] = [];
        for (const col of movesToConsider) {
            const score = this.evaluateMoveComprehensive(board, player, col);
            if (score > bestScore) {
                bestScore = score;
                bestMoves = [col];
            } else if (score === bestScore) {
                bestMoves.push(col);
            }
        }
        if (bestMoves.length > 1) {
            return bestMoves[Math.floor(Math.random() * bestMoves.length)];
        }
        return bestMoves[0];
    }

    private evaluateMoveComprehensive(board: TBoard, player: TPlayer, col: number): number {
        const newBoard = this.makeMove(board, player, col);
        const opponent: TPlayer = player === 'onePlayer' ? 'twoPlayer' : 'onePlayer';
        let score = 0;
        score += this.evaluateBoardAdvanced(newBoard, player);
        const myThreats = this.countThreats(newBoard, player);
        const oppThreats = this.countThreats(newBoard, opponent);
        score += myThreats * 50;
        score -= oppThreats * 40;
        const row = this.getDropRow(board, col);
        if (col === 3) score += 20;
        if (col === 2 || col === 4) score += 10;
        const totalMoves = this.countTotalMoves(board);
        if (totalMoves < 10) {
            score += (ROWS - row) * 3;
        }
        score += this.countConnections(newBoard, player, row, col) * 8;
        return score;
    }

    private evaluateBoardAdvanced(board: TBoard, player: TPlayer): number {
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
                    const window = this.getWindow(board, row, col, dir.dr, dir.dc);
                    if (window.length === 4) {
                        score += this.scoreWindow(window, player);
                    }
                }
            }
        }
        return score;
    }

    private getWindow(board: TBoard, startRow: number, startCol: number, dr: number, dc: number): TCell[] {
        const window: TCell[] = [];
        for (let i = 0; i < 4; i++) {
            const r = startRow + i * dr;
            const c = startCol + i * dc;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
                window.push(board[r][c]);
            }
        }
        return window;
    }

    private scoreWindow(window: TCell[], player: TPlayer): number {
        const opponent: TPlayer = player === 'onePlayer' ? 'twoPlayer' : 'onePlayer';
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

    private countThreats(board: TBoard, player: TPlayer): number {
        let threats = 0;
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (col + 3 < COLS) {
                    const window = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
                    if (this.isThreatenWindow(window, player)) threats++;
                }
                if (row + 3 < ROWS) {
                    const window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
                    if (this.isThreatenWindow(window, player)) threats++;
                }
                if (row + 3 < ROWS && col + 3 < COLS) {
                    const window = [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]];
                    if (this.isThreatenWindow(window, player)) threats++;
                }
                if (row + 3 < ROWS && col - 3 >= 0) {
                    const window = [board[row][col], board[row + 1][col - 1], board[row + 2][col - 2], board[row + 3][col - 3]];
                    if (this.isThreatenWindow(window, player)) threats++;
                }
            }
        }
        return threats;
    }

    private isThreatenWindow(window: TCell[], player: TPlayer): boolean {
        const playerCount = window.filter(c => c === player).length;
        const emptyCount = window.filter(c => c === null).length;
        return playerCount === 3 && emptyCount === 1;
    }

    private countConnections(board: TBoard, player: TPlayer, row: number, col: number): number {
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

    private countTotalMoves(board: TBoard): number {
        let count = 0;
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (board[row][col] !== null) count++;
            }
        }
        return count;
    }

    private getDropRow(board: TBoard, col: number): number {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][col] === null) return row;
        }
        return -1;
    }

    private getValidMoves(board: TBoard): number[] {
        const moves: number[] = [];
        for (let col = 0; col < COLS; col++) {
            if (board[0][col] === null) moves.push(col);
        }
        return moves;
    }

    private makeMove(board: TBoard, player: TPlayer, col: number): TBoard {
        const newBoard = board.map(row => [...row]);
        for (let row = ROWS - 1; row >= 0; row--) {
            if (newBoard[row][col] === null) {
                newBoard[row][col] = player;
                break;
            }
        }
        return newBoard;
    }

    private isWinningMove(board: TBoard, player: TPlayer, col: number): boolean {
        const newBoard = this.makeMove(board, player, col);
        return checkWinner(newBoard).winner === player;
    }
}
