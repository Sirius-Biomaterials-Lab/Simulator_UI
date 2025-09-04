import styles from "./Dropdown.module.scss";

export interface Option {
    value: string;
    label: string;
}

interface DropdownProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    label: string;              // 🆕 label сверху
    disabled?: boolean;
    className?: string;         // опционально для wrapper
}

export function Dropdown({
                             options,
                             value,
                             onChange,
                             label,
                             disabled = false,
                             className,
                         }: DropdownProps) {
    return (
        <div className={[styles.wrapper, className ?? ""].join(" ").trim()}>
            <label className={styles.label}>{label}</label>
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
