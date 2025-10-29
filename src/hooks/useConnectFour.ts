import { useCallback, useState, useRef } from 'react';
import { getAIMove, type Difficulty } from '../hooks/useConnectFourAI';
import { COLS, ROWS } from '../styles/variables/constans';

export type Player = "onePlayer" | "twoPlayer";
export type Cell = Player | null;
export type Board = Cell[][];
export type Position = [number, number];

function createEmptyBoard(): Board {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function checkWinner(board: Board): { winner: Player | null; positions?: Position[] } {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const player = board[row][col];
            if (!player) continue;
            
            if (
                col + 3 < COLS &&
                player === board[row][col + 1] &&
                player === board[row][col + 2] &&
                player === board[row][col + 3]
            ) return {
                winner: player,
                positions: [[row, col], [row, col + 1], [row, col + 2], [row, col + 3]]
            };
            
            if (
                row + 3 < ROWS &&
                player === board[row + 1][col] &&
                player === board[row + 2][col] &&
                player === board[row + 3][col]
            ) return {
                winner: player,
                positions: [[row, col], [row + 1, col], [row + 2, col], [row + 3, col]]
            };
            
            if (
                row + 3 < ROWS && col + 3 < COLS &&
                player === board[row + 1][col + 1] &&
                player === board[row + 2][col + 2] &&
                player === board[row + 3][col + 3]
            ) return {
                winner: player,
                positions: [[row, col], [row + 1, col + 1], [row + 2, col + 2], [row + 3, col + 3]]
            };
            
            if (
                row + 3 < ROWS && col - 3 >= 0 &&
                player === board[row + 1][col - 1] &&
                player === board[row + 2][col - 2] &&
                player === board[row + 3][col - 3]
            ) return {
                winner: player,
                positions: [[row, col], [row + 1, col - 1], [row + 2, col - 2], [row + 3, col - 3]]
            };
        }
    }
    return { winner: null };
}

function isBoardFull(board: Board): boolean {
    return board[0].every(cell => cell !== null);
}

export function useConnectFour(aiEnabled: boolean = false, difficulty: Difficulty = 'medium') {
    const [board, setBoard] = useState<Board>(createEmptyBoard());
    const [currentPlayer, setCurrentPlayer] = useState<Player>('onePlayer');
    const [winner, setWinner] = useState<Player | null>(null);
    const [isDraw, setIsDraw] = useState(false);
    const [winningPositions, setWinningPositions] = useState<Position[]>([]);
    
    const currentPlayerRef = useRef<Player>('onePlayer');
    const aiThinkingRef = useRef(false);
    const aiTimeoutRef = useRef<number | null>(null);
    
    currentPlayerRef.current = currentPlayer;

    const makeAIMove = useCallback(() => {
        if (aiThinkingRef.current) return;
        
        aiThinkingRef.current = true;
        
        setBoard((prevBoard) => {
            const aiMove = getAIMove(prevBoard, 'twoPlayer', difficulty);
            
            if (aiMove === -1) {
                aiThinkingRef.current = false;
                return prevBoard;
            }
            
            for (let row = ROWS - 1; row >= 0; row--) {
                if (!prevBoard[row][aiMove]) {
                    const newBoard = prevBoard.map((r) => [...r]);
                    newBoard[row][aiMove] = 'twoPlayer';
                    
                    const result = checkWinner(newBoard);
                    
                    if (result.winner) {
                        setWinner(result.winner);
                        setWinningPositions(result.positions || []);
                    } else if (isBoardFull(newBoard)) {
                        setIsDraw(true);
                    }
                    else {
                        setCurrentPlayer('onePlayer');
                    }
                    
                    aiThinkingRef.current = false;
                    return newBoard;
                }
            }
            
            aiThinkingRef.current = false;
            return prevBoard;
        });
    }, [difficulty]);

    const dropDisc = useCallback((col: number) => {
        if (winner || aiThinkingRef.current || isDraw) return;
        
        const player = currentPlayerRef.current;
        
        if (aiEnabled && player === 'twoPlayer') return;

        setBoard((prevBoard) => {

            for (let row = ROWS - 1; row >= 0; row--) {
                if (!prevBoard[row][col]) {
                    const newBoard = prevBoard.map((r) => [...r]);
                    newBoard[row][col] = player;
                    
                    const result = checkWinner(newBoard);
                    
                    if (result.winner) {
                        setWinner(result.winner);
                        setWinningPositions(result.positions || []);
                    } else if (isBoardFull(newBoard)) {
                        setIsDraw(true);
                    } 
                    else {
                        const nextPlayer = player === "onePlayer" ? "twoPlayer" : "onePlayer";
                        setCurrentPlayer(nextPlayer);
                        
                        if (aiEnabled && nextPlayer === 'twoPlayer') {
                            if (aiTimeoutRef.current !== null) {
                                clearTimeout(aiTimeoutRef.current);
                            }
                            
                            aiTimeoutRef.current = window.setTimeout(() => {
                                makeAIMove();
                                aiTimeoutRef.current = null;
                            }, 600);
                        }
                    }
                    
                    return newBoard;
                }
            }
            
            return prevBoard;
        });
    }, [winner, isDraw, aiEnabled, makeAIMove]);

    const resetGame = useCallback(() => {
        if (aiTimeoutRef.current !== null) {
            clearTimeout(aiTimeoutRef.current);
            aiTimeoutRef.current = null;
        }
        
        aiThinkingRef.current = false;
        setBoard(createEmptyBoard());
        setCurrentPlayer("onePlayer");
        setWinner(null);
        setIsDraw(false);
        setWinningPositions([]);
    }, []);

    return {
        board,
        currentPlayer,
        winner,
        winningPositions,
        isDraw,
        dropDisc,
        resetGame,
    };
}
