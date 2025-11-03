import { Board } from "../../components/boards/board";
import { ModalWinner } from '../../components/modalWinner/modalWinner.tsx';
import { Player } from "../../components/player/player";
import type { TDifficulty } from '../../gameLogic/connectFourAI.ts';
import { COLORS_TRICKS } from "../../styles/variables/constans";
import styles from './gamePage.module.css';
import { useConnectFour } from '../../hooks/useConnectFour';
import { Button } from "../../components/button/button";
import { Link } from "react-router";
import { useGameSettings } from '../../hooks/useGameSettings';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TCountDownHandle } from "../../components/timer/timer";
import { useTranslation } from "react-i18next";

const DEFAULT_PLAYER1 = 'red';
const DEFAULT_PLAYER2 = 'blue';

type WinnerReason = 'standard' | 'time';

export const GamePage = () => {
    const { t } = useTranslation('game');
    const {
        settings,
        setPlayer1Color,
        setPlayer2Color,
        setPlayer1Name,
        setPlayer2Name,
    } = useGameSettings();

    const {
        player1Color: player1ColorKey,
        player2Color: player2ColorKey,
        player1Name,
        player2Name,
        timerEnabled,
        aiEnabled,
        aiDifficulty
    } = settings;

    const player1TimerRef = useRef<TCountDownHandle>(null);
    const player2TimerRef = useRef<TCountDownHandle>(null);
    const processedWinnerRef = useRef<string | null>(null);

    const [winReason, setWinReason] = useState<WinnerReason>('standard');
    const [timeoutPlayer, setTimeoutPlayer] = useState<string | null>(null);

    const playerOneHex = useMemo(() => {
        const key = (player1ColorKey ?? DEFAULT_PLAYER1) as string;
        return (COLORS_TRICKS as Record<string, string>)[key] ?? key;
    }, [player1ColorKey]);

    const playerTwoHex = useMemo(() => {
        const key = (player2ColorKey ?? DEFAULT_PLAYER2) as string;
        return (COLORS_TRICKS as Record<string, string>)[key] ?? key;
    }, [player2ColorKey]);

    const [player1Wins, setPlayer1Wins] = useState(0);
    const [player2Wins, setPlayer2Wins] = useState(0);

    const {
        board,
        currentPlayer,
        winner,
        dropTrick,
        resetGame,
        winningPositions,
        isDraw
    } = useConnectFour(
        aiEnabled ?? false,
        (aiDifficulty as TDifficulty) ?? 'medium'
    );

    const handleNewGame = useCallback(() => {
        setPlayer1Wins(0);
        setPlayer2Wins(0);
        resetGame();
        player1TimerRef.current?.reset();
        player2TimerRef.current?.reset();
        processedWinnerRef.current = null;
        setWinReason('standard');
        setTimeoutPlayer(null);
    }, [resetGame]);

    useEffect(() => {
        if (!winner || processedWinnerRef.current === winner) return;
        processedWinnerRef.current = winner;
        if (winner === 'onePlayer') {
            setPlayer1Wins((prev: number) => prev + 1);
        } else if (winner === 'twoPlayer') {
            setPlayer2Wins((prev: number) => prev + 1);
        }
    }, [winner]);

    const handlePlayer1TimeUp = useCallback(() => {
        if (!winner) {
            setPlayer2Wins((prev: number) => prev + 1);
            setWinReason('time');
            setTimeoutPlayer(player1Name ?? 'player_1');
        }
    }, [winner, player1Name]);

    const handlePlayer2TimeUp = useCallback(() => {
        if (!winner) {
            setPlayer1Wins((prev: number) => prev + 1);
            setWinReason('time');
            setTimeoutPlayer(player2Name ?? 'player_2');
        }
    }, [winner, player2Name]);

    const handleResetGame = useCallback(() => {
        resetGame();
        player1TimerRef.current?.reset();
        player2TimerRef.current?.reset();
        processedWinnerRef.current = null;
        setWinReason('standard');
        setTimeoutPlayer(null);
    }, [resetGame]);



    const newGameButtonText = useMemo(() => t('Новая игра'), [t]);
    const settingsButtonText = useMemo(() => t('Настройки'), [t]);

    const showModal = winner !== null || isDraw || winReason === 'time';

    return (
        <div className={styles.gamePage}>
            <div className={styles.headerPage}>
                <Link to="/">
                    <Button className="secondary">
                        {t('Назад')}
                    </Button>
                </Link>
                <Button
                    className="primary"
                    onClick={handleNewGame}>
                    {newGameButtonText}
                </Button>
                <Link to="/settings">
                    <Button className="clear">
                        {settingsButtonText}
                    </Button>
                </Link>
            </div>
            <div className={styles.playerBlock}>
                <Player
                    isActive={currentPlayer === 'onePlayer'}
                    location={false}
                    name={player1Name}
                    onNameChange={setPlayer1Name}
                    colorKey={player1ColorKey}
                    forbiddenColorKey={player2ColorKey}
                    onColorChange={setPlayer1Color}
                    storageKey={'player1Color'}
                    score={player1Wins ?? 0}
                    onTimeOver={handlePlayer1TimeUp}
                    gameEnded={!!winner}
                    timerRef={player1TimerRef}
                    timerEnabled={timerEnabled}
                />
                <div className={styles.vsText}>
                    :
                </div>
                <Player
                    isActive={currentPlayer === 'twoPlayer'}
                    location={true}
                    name={aiEnabled ? t('Компьютер') : player2Name}
                    onNameChange={aiEnabled ? undefined : setPlayer2Name}
                    colorKey={player2ColorKey}
                    forbiddenColorKey={player1ColorKey}
                    onColorChange={setPlayer2Color}
                    storageKey={'player2Color'}
                    score={player2Wins ?? 0}
                    onTimeOver={handlePlayer2TimeUp}
                    gameEnded={!!winner}
                    timerRef={player2TimerRef}
                    timerEnabled={timerEnabled}
                />
            </div>
            <Board
                board={board}
                winner={winner}
                dropTrick={dropTrick}
                currentPlayer={currentPlayer}
                playerOneHex={playerOneHex}
                playerTwoHex={playerTwoHex}
                winningPositions={winningPositions}
                isDraw={isDraw}
            />


            <ModalWinner
                showModal={showModal}
                isDraw={isDraw}
                handleResetGame={handleResetGame}
                winReason={winReason}
                winner={winner}
                timeoutPlayer={timeoutPlayer}
                player1Name={player1Name}
                player2Name={player2Name}
                aiEnabled={aiEnabled}
            />
        </div>
    );
}
