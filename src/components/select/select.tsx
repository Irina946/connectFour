import React from 'react';
import styles from './select.module.css';

interface Option {
    label: string;
    value: string;
}

interface SelectProps {
    label?: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({ label, value, options, onChange }) => {
    return (
        <label className={styles.selectBlock}>
            {label
                && <span className={styles.selectLabel}>
                    {label}
                </span>}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={styles.select}
            >
                {options.map((opt) => (
                    <option
                        key={opt.value}
                        value={opt.value}
                        className={styles.selectOption}
                    >
                        {opt.label}
                    </option>
                ))}
            </select>
        </label>
    );
};

export default Select;
