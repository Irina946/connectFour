import { ButtonHTMLAttributes, memo } from 'react';
import styles from './button.module.css';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: 'primary' | 'secondary' | 'clear';
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
}

export const Button = memo((props: IButtonProps) => {
    const {
        className,
        children,
        size,
        ...otherProps
    } = props;

    const typeClass = (() => {
        switch (className) {
            case 'primary':
                return styles.primary;
            case 'secondary':
                return styles.secondary;
            case 'clear':
                return styles.clear;
        }
    })();

    const sizeClass = (() => {
        switch (size) {
            case 'xs':
                return styles.sizeXS;
            case 's':
                return styles.sizeS;
            case 'm':
                return styles.sizeM;
            case 'l':
                return styles.sizeL;
            case 'xl':
                return styles.sizeXL;
        }
    })();

    return (
        <button
            className={`${styles.button} ${typeClass} ${sizeClass}`}
            {...otherProps}
        >
            {children}
        </button>
    )
})

Button.displayName = 'Button';
