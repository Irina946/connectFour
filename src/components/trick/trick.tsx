import styles from './trick.module.css';

interface ITrickProps {
    color?: string;
    size?: string;
}

export const Trick = (props: ITrickProps) => {
    const { color, size } = props;

    const sizeKeyToVar = (s?: string) => {
        if (!s) return undefined;
        const map: Record<string, string> = {
            extraSmall: 'var(--chip-size-xs)',
            small: 'var(--chip-size-s)',
            medium: 'var(--chip-size-m)',
            large: 'var(--chip-size-l)',
            extraLarge: 'var(--chip-size-xl)'
        };
        return map[s] ?? s; 
    }

    const sizeValue = sizeKeyToVar(size);

    return (
        <div
            className={`${styles.trick}`}
            style={{ backgroundColor: color, width: sizeValue, height: sizeValue }}
        />
    );
}