import { useCallback, useState } from 'react';
import { ConnectFour } from '../gameLogic/connectFour';
import type { TDifficulty } from '../gameLogic/connectFourAI.ts';
import type { TPlayer, TBoard, TPosition } from '../gameLogic/types';

export function useConnectFour(aiEnabled: boolean = false, difficulty: TDifficulty = 'medium') {
    const [game] = useState(() => new ConnectFour(aiEnabled, difficulty));
    const [board, setBoard] = useState<TBoard>(game.board);
    const [currentPlayer, setCurrentPlayer] = useState<TPlayer>(game.currentPlayer);
    const [winner, setWinner] = useState<TPlayer | null>(game.winner);
    const [isDraw, setIsDraw] = useState(game.isDraw);
    const [winningPositions, setWinningPositions] = useState<TPosition[]>(game.winningPositions);

    const syncState = useCallback(() => {
        setBoard(game.board);
        setCurrentPlayer(game.currentPlayer);
        setWinner(game.winner);
        setIsDraw(game.isDraw);
        setWinningPositions(game.winningPositions);
    }, [game]);

    const dropTrick = useCallback((col: number) => {
        game.dropTrick(col, syncState);
        syncState();
    }, [game, syncState]);

    const resetGame = useCallback(() => {
        game.reset();
        syncState();
    }, [game, syncState]);

    return {
        board,
        currentPlayer,
        winner,
        winningPositions,
        isDraw,
        dropTrick,
        resetGame,
    };
}
