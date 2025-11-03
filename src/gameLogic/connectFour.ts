import { ConnectFourAI, type TDifficulty } from './connectFourAI';
import { COLS, ROWS } from '../styles/variables/constans';
import type { TPlayer, TBoard, TPosition } from './types.ts';
import { checkWinner } from './winnerUtils';
import { LocalStorageService } from '../utils/LocalStorageService';

export class ConnectFour {
    board: TBoard;
    currentPlayer: TPlayer;
    winner: TPlayer | null;
    isDraw: boolean;
    winningPositions: TPosition[];
    aiEnabled: boolean;
    difficulty: TDifficulty;
    private aiThinking: boolean;
    private aiTimeout: number | null;
    private ai: ConnectFourAI;

    static BOARD_STORAGE_KEY = 'board';

    private saveBoardToStorage() {
        try {
            LocalStorageService.set<TBoard>(ConnectFour.BOARD_STORAGE_KEY, this.board);
        } catch (e) {
            // ignore
        }
    }

    private loadBoardFromStorage(): TBoard | undefined {
        try {
            const parsed = LocalStorageService.get<TBoard>(ConnectFour.BOARD_STORAGE_KEY);
            if (Array.isArray(parsed) && parsed.length === ROWS) {
                return parsed;
            }
        } catch (e) {
            // ignore
        }
        return undefined;
    }

    constructor(aiEnabled: boolean = false, difficulty: TDifficulty = 'medium') {
        const loadedBoard = this.loadBoardFromStorage();
        this.board = loadedBoard ?? ConnectFour.createEmptyBoard();
        this.currentPlayer = 'onePlayer';
        this.winner = null;
        this.isDraw = false;
        this.winningPositions = [];
        this.aiEnabled = aiEnabled;
        this.difficulty = difficulty;
        this.aiThinking = false;
        this.aiTimeout = null;
        this.ai = new ConnectFourAI(difficulty);
    }

    static createEmptyBoard(): TBoard {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    }

    static checkWinnerWithPositions(board: TBoard): { winner: TPlayer | null; positions?: TPosition[] } {
        const result = checkWinner(board);
        return {
            winner: result.winner,
            positions: result.positions ?? undefined,
        };
    }

    static isBoardFull(board: TBoard): boolean {
        return board[0].every(cell => cell !== null);
    }

    dropTrick(col: number, onAIMove?: () => void) {
        if (this.winner || this.aiThinking || this.isDraw) return;
        const player = this.currentPlayer;
        if (this.aiEnabled && player === 'twoPlayer') return;
        for (let row = ROWS - 1; row >= 0; row--) {
            if (!this.board[row][col]) {
                const newBoard = this.board.map(r => [...r]);
                newBoard[row][col] = player;
                this.board = newBoard;
                this.saveBoardToStorage();
                const result = ConnectFour.checkWinnerWithPositions(newBoard);
                if (result.winner) {
                    this.winner = result.winner;
                    this.winningPositions = result.positions || [];
                } else if (ConnectFour.isBoardFull(newBoard)) {
                    this.isDraw = true;
                } else {
                    this.currentPlayer = player === 'onePlayer' ? 'twoPlayer' : 'onePlayer';
                    if (this.aiEnabled && this.currentPlayer === 'twoPlayer') {
                        if (this.aiTimeout !== null) {
                            clearTimeout(this.aiTimeout);
                        }
                        this.aiTimeout = window.setTimeout(() => {
                            this.makeAIMove();
                            if (onAIMove) onAIMove();
                            this.saveBoardToStorage();
                            this.aiTimeout = null;
                        }, 600);
                    }
                }
                break;
            }
        }
    }

    makeAIMove() {
        if (this.aiThinking) return;
        this.aiThinking = true;
        const aiMove = this.ai.getMove(this.board, 'twoPlayer');
        if (aiMove === -1) {
            this.aiThinking = false;
            return;
        }
        for (let row = ROWS - 1; row >= 0; row--) {
            if (!this.board[row][aiMove]) {
                const newBoard = this.board.map(r => [...r]);
                newBoard[row][aiMove] = 'twoPlayer';
                this.board = newBoard;
                const result = ConnectFour.checkWinnerWithPositions(newBoard);
                if (result.winner) {
                    this.winner = result.winner;
                    this.winningPositions = result.positions || [];
                } else if (ConnectFour.isBoardFull(newBoard)) {
                    this.isDraw = true;
                } else {
                    this.currentPlayer = 'onePlayer';
                }
                break;
            }
        }
        this.aiThinking = false;
    }

    reset() {
        this.board = ConnectFour.createEmptyBoard();
        this.currentPlayer = 'onePlayer';
        this.winner = null;
        this.isDraw = false;
        this.winningPositions = [];
        LocalStorageService.remove(ConnectFour.BOARD_STORAGE_KEY);
    }

    setDifficulty(difficulty: TDifficulty) {
        this.difficulty = difficulty;
        this.ai.setDifficulty(difficulty);
    }

    enableAI(enabled: boolean) {
        this.aiEnabled = enabled;
        if (enabled && this.currentPlayer === 'twoPlayer') {
            this.makeAIMove();
        }
    }
}
