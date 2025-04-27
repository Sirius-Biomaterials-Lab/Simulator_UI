import styles from "./Dropdown.module.scss";

interface Option {
    value: string;
    label: string;
}

interface DropdownProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
}

export function Dropdown({ options, value, onChange }: DropdownProps) {
    return (
        <select
            className={styles.dropdown}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
