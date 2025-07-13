import styles from "./Dropdown.module.scss";

export interface Option {
    value: string;
    label: string;
}

interface DropdownProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function Dropdown({
                             options,
                             value,
                             onChange,
                             disabled = false,
                         }: DropdownProps) {
    return (
        <div className={styles.wrapper}>
            <select
                className={styles.select}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map(({ value: v, label }) => (
                    <option key={v} value={v}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
}
