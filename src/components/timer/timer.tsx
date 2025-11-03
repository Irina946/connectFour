import { 
    useEffect, 
    useState, 
    useRef, 
    useImperativeHandle, 
    forwardRef, 
    useCallback } from 'react';
import styles from './timer.module.css';

type TCountDownProps = {
    minutes?: number;
    seconds?: number;
    isActive?: boolean;
    onTimeOver?: () => void;
    gameEnded?: boolean;
};

export type TCountDownHandle = {
    stop: () => void;
    pause: () => void;
    resume: () => void;
    reset: () => void;
};

export const CountDown = forwardRef<TCountDownHandle, TCountDownProps>(
    ({
        minutes = 0,
        seconds = 0,
        isActive = false,
        onTimeOver,
        gameEnded },
        ref
    ) => {
        const [over, setOver] = useState(false);
        const [[m, s], setTime] = useState<[number, number]>([minutes, seconds]);

        const overRef = useRef(over);
        const gameEndedRef = useRef(gameEnded);
        const mountedRef = useRef(true);

        useEffect(() => { gameEndedRef.current = gameEnded; }, [gameEnded]);
        useEffect(() => { overRef.current = over; }, [over]);

        useEffect(() => {
            const id = setInterval(() => {
                if (!isActive || overRef.current || gameEndedRef.current) return;

                setTime(([prevM, prevS]) => {
                    if (prevM === 0 && prevS === 0) {
                        if (mountedRef.current) {
                            setOver(true);
                            onTimeOver?.()
                        } return [0, 0];
                    }
                    if (prevS === 0) return [prevM - 1, 59];
                    return [prevM, prevS - 1];
                })
            }, 1000);
            return () => clearInterval(id);
        }, [isActive, onTimeOver]);

        useEffect(() => {
            mountedRef.current = true;
            return () => { mountedRef.current = false; };
        }, []);

        const stop = useCallback(() => {
            setOver(true);
        }, []);

        const pause = useCallback(() => {
        }, []);

        const resume = useCallback(() => {
        }, []);

        const reset = useCallback(() => {
            setTime([minutes, seconds]);
            setOver(false);
        }, [minutes, seconds]);

        useImperativeHandle(ref, () => ({ stop, pause, resume, reset }), [stop, pause, resume, reset]);

        return (
            <div className={styles.timer}>
                <p>
                    {`${m.toString()}:${s.toString().padStart(2, '0')}`}
                </p>
                {over && <div style={{ fontSize: '12px', color: 'red' }}>Время вышло!</div>}
            </div>
        );
    }
);

CountDown.displayName = 'CountDown';