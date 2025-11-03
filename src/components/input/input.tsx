import { InputHTMLAttributes } from 'react';
import styles from './input.module.css';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    placeholder?: string;
    id: string
}

export const Input = (props: IInputProps) => {
    const {
        label,
        placeholder,
        ...otherProps
    } = props;

    return <label className={styles.inputBlock}>
        {label}
        <input
            className={styles.input}
            type="text" 
            placeholder={placeholder}
            {...otherProps}
        />
    </label>
}