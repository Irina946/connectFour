import styles from './input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    placeholder?: string;
    id: string
}

export const Input = (props: InputProps) => {
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