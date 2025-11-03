import styles from './checked.module.css';

interface ICheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
}

export const Checkbox = (props: ICheckboxProps): JSX.Element => {
    const { checked, onChange, label } = props;

    const handleToggle = () => {
        onChange(!checked);
    }

    return (
        <label className={styles.checkboxBlock}>
            {label}
            <input
                type="checkbox"
                checked={checked}
                onChange={handleToggle}
                className={styles.hidden}
                />
                <div className={styles.checkbox}>
                    {checked && 
                        <div className={styles.checked}></div>
                    }
                </div>
        </label>

    );
};
