import type { TBoard, TPlayer } from './types';

export type TWinnerResult = {
    winner: TPlayer | null;
    positions?: [number, number][];
};

export function checkWinner(board: TBoard): TWinnerResult {
    const COLS = board[0].length;
    const ROWS = board.length;
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const player = board[row][col];
            if (!player) continue;
            // Горизонтально
            if (
                col + 3 < COLS &&
                player === board[row][col + 1] &&
                player === board[row][col + 2] &&
                player === board[row][col + 3]
            ) {
                return {
                    winner: player,
                    positions: [
                        [row, col],
                        [row, col + 1],
                        [row, col + 2],
                        [row, col + 3],
                    ],
                };
            }
            // Вертикально
            if (
                row + 3 < ROWS &&
                player === board[row + 1][col] &&
                player === board[row + 2][col] &&
                player === board[row + 3][col]
            ) {
                return {
                    winner: player,
                    positions: [
                        [row, col],
                        [row + 1, col],
                        [row + 2, col],
                        [row + 3, col],
                    ],
                };
            }
            // Диагональ вправо вниз
            if (
                row + 3 < ROWS && col + 3 < COLS &&
                player === board[row + 1][col + 1] &&
                player === board[row + 2][col + 2] &&
                player === board[row + 3][col + 3]
            ) {
                return {
                    winner: player,
                    positions: [
                        [row, col],
                        [row + 1, col + 1],
                        [row + 2, col + 2],
                        [row + 3, col + 3],
                    ],
                };
            }
            // Диагональ влево вниз
            if (
                row + 3 < ROWS && col - 3 >= 0 &&
                player === board[row + 1][col - 1] &&
                player === board[row + 2][col - 2] &&
                player === board[row + 3][col - 3]
            ) {
                return {
                    winner: player,
                    positions: [
                        [row, col],
                        [row + 1, col - 1],
                        [row + 2, col - 2],
                        [row + 3, col - 3],
                    ],
                };
            }
        }
    }
    return { winner: null };
}
