import { Board } from "../../components/boards/board";
import { Player } from "../../components/player/player";
import { COLORS_TRICKS } from "../../styles/variables/constans";
import styles from './gamePage.module.css';
import { useConnectFour } from '../../hooks/useConnectFour';
import { Modal } from "../../components/modal/modal";
import { Button } from "../../components/button/button";
import { Link } from "react-router";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CountDownHandle } from "../../components/timer/timer";
import { Difficulty } from "../../hooks/useConnectFourAI";
import { useTranslation } from "react-i18next";

const DEFAULT_PLAYER1 = 'red';
const DEFAULT_PLAYER2 = 'blue';

type WinnerReason = 'standart' | 'time';

export const GamePage = () => {
    const { t } = useTranslation('game');
    const [player1ColorKey, setPlayer1ColorKey] = useLocalStorage<string>('player1Color', DEFAULT_PLAYER1);
    const [player2ColorKey, setPlayer2ColorKey] = useLocalStorage<string>('player2Color', DEFAULT_PLAYER2);
    const [player1Name, setPlayer1Name] = useLocalStorage<string>('player1Name', 'Игрок 1');
    const [player2Name, setPlayer2Name] = useLocalStorage<string>('player2Name', 'Игрок 2');
    const [timerEnabled] = useLocalStorage<boolean>('timerEnabled', false);

    const [aiEnabled] = useLocalStorage<boolean>('aiEnabled', false);
    const [aiDifficulty] = useLocalStorage<string>('aiDifficulty', 'medium');

    const player1TimerRef = useRef<CountDownHandle>(null);
    const player2TimerRef = useRef<CountDownHandle>(null);
    const processedWinnerRef = useRef<string | null>(null);

    const [winReason, setWinReason] = useState<WinnerReason>('standart');
    const [timeoutPlayer, setTimeoutPlayer] = useState<string | null>(null);

    const playerOneHex = useMemo(() => {
        const key = (player1ColorKey ?? DEFAULT_PLAYER1) as string;
        return (COLORS_TRICKS as Record<string, string>)[key] ?? key;
    }, [player1ColorKey]);

    const playerTwoHex = useMemo(() => {
        const key = (player2ColorKey ?? DEFAULT_PLAYER2) as string;
        return (COLORS_TRICKS as Record<string, string>)[key] ?? key;
    }, [player2ColorKey]);

    const { board, currentPlayer, winner, dropDisc, resetGame, winningPositions } = useConnectFour(
        aiEnabled ?? false,
        (aiDifficulty as Difficulty) ?? 'medium'
    );
    const [player1Wins, setPlayer1Wins] = useLocalStorage<number>('player1Wins', 0);
    const [player2Wins, setPlayer2Wins] = useLocalStorage<number>('player2Wins', 0);

    const handleNewGame = useCallback(() => {
        setPlayer1Wins?.(0);
        setPlayer2Wins?.(0);
        resetGame();
        player1TimerRef.current?.reset();
        player2TimerRef.current?.reset();
    }, [setPlayer1Wins, setPlayer2Wins, resetGame]);

    useEffect(() => {
        if (!winner || processedWinnerRef.current === winner) return;
        processedWinnerRef.current = winner;
        if (winner === 'onePlayer') {
            setPlayer1Wins((prev) => ((prev ?? 0) + 1));
        } else if (winner === 'twoPlayer') {
            setPlayer2Wins((prev) => ((prev ?? 0) + 1));
        }
    }, [winner, setPlayer1Wins, setPlayer2Wins]);

    const handlePlayer1TimeUp = useCallback(() => {
        if (!winner) {
            // Игрок 1 проиграл по времени
            setPlayer2Wins((prev) => ((prev ?? 0) + 1));
            setWinReason('time');
            setTimeoutPlayer(player1Name ?? 'player_1');
            resetGame();
        }
    }, [winner, player1Name, setPlayer2Wins, setWinReason, setTimeoutPlayer, resetGame]);

    const handlePlayer2TimeUp = useCallback(() => {
        if (!winner) {
            // Игрок 2 проиграл по времени
            setPlayer1Wins((prev) => ((prev ?? 0) + 1));
            setWinReason('time');
            setTimeoutPlayer(player2Name ?? 'player_2');
            resetGame();
        }
    }, [winner, player2Name, setPlayer1Wins, setWinReason, setTimeoutPlayer, resetGame]);

    const handleResetGame = useCallback(() => {
        resetGame();
        player1TimerRef.current?.reset();
        player2TimerRef.current?.reset();
        processedWinnerRef.current = null;

        setTimeout(() => {
            setWinReason('standart');
            setTimeoutPlayer(null);
        }, 100)
    }, [resetGame]);

    const isModalOpen = !!winner || winReason === 'time';

    const getModalMessage = useCallback(() => {
        if (winReason === 'time' && timeoutPlayer) {
            const winnerName = timeoutPlayer === (player1Name ?? 'player_1')
                ? (player2Name ?? 'player_2')
                : (player1Name ?? 'player_1');
            return t('Время вышло, победил: {{name}}!', { name: winnerName });
        }
        return t('Победитель: {{name}}!', { name: winner === 'onePlayer' ? (player1Name ?? '') : (player2Name ?? '') })
    }, [winReason, timeoutPlayer, player1Name, player2Name, t, winner]);

    const newGameButtonText = useMemo(() => t('Новая игра'), [t]);
    const settingsButtonText = useMemo(() => t('Настройки'), [t]);
    const playAgainButtonText = useMemo(() => t('Начать игру'), [t]);

    return (
        <div className={styles.gamePage}>
            <div className={styles.headerPage}>
                <Link to="/">
                    <Button
                        className="secondary">
                        {t('Назад')}
                    </Button>
                </Link>
                <Button
                    className="primary"
                    onClick={handleNewGame}>
                    {newGameButtonText}
                </Button>
                <Link to="/settings">
                    <Button
                        className="clear"
                    >
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
                    onColorChange={setPlayer1ColorKey}
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
                    onColorChange={setPlayer2ColorKey}
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
                dropDisc={dropDisc}
                currentPlayer={currentPlayer}
                playerOneHex={playerOneHex}
                playerTwoHex={playerTwoHex}
                winningPositions={winningPositions}
            />
            <Modal
                isOpen={isModalOpen}
                onClose={handleResetGame}>
                <div className={styles.winnerModal}>
                    <div>
                        {getModalMessage()}
                    </div>
                    <div style={{ marginTop: 12 }}>
                        <Button
                            className="primary"
                            onClick={handleResetGame}
                        >
                            {playAgainButtonText}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}