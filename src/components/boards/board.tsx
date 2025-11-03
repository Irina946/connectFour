import type { TPlayer, TBoard } from '../../gameLogic/types.ts';
import styles from './board.module.css';
import { ElementBoard } from './elementBoard';
import { useState, memo, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface IBoardProps {
    board: TBoard;
    winner: TPlayer | null;
    dropTrick: (col: number) => void;
    currentPlayer: TPlayer;
    playerOneHex: string;
    playerTwoHex: string;
    winningPositions: number[][];
    isDraw: boolean;
}

export const Board = memo((props: IBoardProps) => {
    const {
        board,
        winner,
        dropTrick,
        currentPlayer,
        playerOneHex,
        playerTwoHex,
        winningPositions,
        isDraw
    } = props;

    const { theme } = useTheme();
    const emptyBg = useMemo(() =>
        theme === 'dark' ? '#777777' : '#ffffff',
        [theme]
    );

    const cols = board[0]?.length ?? 7;
    const rows = board.length;
    const [hoverCol, setHoverCol] = useState<number | null>(null);

    const currentHex = currentPlayer === 'onePlayer' ? playerOneHex : playerTwoHex;

    const handleDrop = (colIdx: number) => {
        if (winner || isDraw) return;
        dropTrick(colIdx);

    };

    const handleMouseEnter = (colIdx: number) => {
        setHoverCol(colIdx);
    };

    const handleMouseLeave = () => {
        setHoverCol(null);
    };

    const boardStructure = useMemo(() => {
        return Array.from({ length: cols }).map((_, colIdx) => ({
            colIdx,
            cells: Array.from({ length: rows }).map((__, rowIdx) => ({
                rowIdx,
                value: board[rowIdx][colIdx]
            }))
        }));
    }, [board, cols, rows]);

    return (
        <div className={styles.boardWrapper}>
            <div className={styles.arrowRow}>
                {Array.from({ length: cols }).map((_, colIdx) => (
                    <div
                        key={`arrow-${colIdx}`}
                        className={styles.arrowSlot}
                        onClick={() => handleDrop(colIdx)}
                    >
                        {hoverCol === colIdx && !winner && (
                            <div className={styles.arrow} style={{ borderBottomColor: currentHex }} />
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.board}>
                {boardStructure.map(({ colIdx, cells }) => (
                    <div
                        key={`col-${colIdx}`}
                        className={styles.column}
                        onMouseEnter={() => handleMouseEnter(colIdx)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {cells.map(({ rowIdx, value }) => {
                            const isWinning = winningPositions?.some(
                                ([r, c]) => r === rowIdx && c === colIdx
                            );

                            return (
                                <ElementBoard
                                    key={`${rowIdx}-${colIdx}`}
                                    value={value}
                                    onClick={handleDrop}
                                    colIdx={colIdx}
                                    rowIdx={rowIdx}
                                    disabled={!!value || !!winner}
                                    playerOneColor={playerOneHex}
                                    playerTwoColor={playerTwoHex}
                                    emptyBg={emptyBg}
                                    isWinning={isWinning}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
});

Board.displayName = 'Board';
