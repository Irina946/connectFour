import styles from './board.module.css';
import { memo, useEffect, useRef, useState } from 'react';

interface IElementBoardProps {
    value: "onePlayer" | "twoPlayer" | null;
    onClick: (colIdx: number) => void;
    disabled?: boolean;
    playerOneColor?: string;
    playerTwoColor?: string;
    colIdx: number;
    rowIdx: number;
    emptyBg: string;
    isWinning?: boolean
}

export const ElementBoard = memo((props: IElementBoardProps) => {
    const {
        value,
        onClick,
        disabled,
        playerOneColor,
        playerTwoColor,
        colIdx,
        emptyBg,
        isWinning = false
    } = props;

    const [isNewChip, setIsNewChip] = useState(false);
    const prevValueRef = useRef(value);

    useEffect(() => {
        if (!prevValueRef.current && value) {
            setIsNewChip(true);
            const timer = setTimeout(() => {
                setIsNewChip(false);
            }, 500)
            return () => clearTimeout(timer);
        }
        prevValueRef.current = value;
    }, [value]);

    const finalColor = value === "onePlayer"
        ? playerOneColor
        : value === "twoPlayer"
            ? playerTwoColor
            : emptyBg;

    const background = value ? finalColor : emptyBg;

    const handleClick = () => {
        if (!disabled) {
            onClick(colIdx);
        }
    }

    return (
        <button
            className={`${styles.elementBoard} 
            ${isNewChip && !isWinning ? styles.fillAnimation : ''}
            ${isWinning ? styles.winning : ''}`}
            onClick={handleClick}
            disabled={disabled}
            style={{
                background: background,
                cursor: disabled ? "not-allowed" : "pointer",
                ['--final-color' as string]: finalColor,
                ['--empty-color' as string]: emptyBg,
                ['--glow-color' as string]: isWinning ? finalColor : '',
            }}
        />
    );
},
    (prevProps, nextProps) => {
        return (
            prevProps.value === nextProps.value &&
            prevProps.disabled === nextProps.disabled &&
            prevProps.playerOneColor === nextProps.playerOneColor &&
            prevProps.playerTwoColor === nextProps.playerTwoColor &&
            prevProps.emptyBg === nextProps.emptyBg &&
            prevProps.isWinning === nextProps.isWinning
        );
    })

ElementBoard.displayName = 'ElementBoard';
