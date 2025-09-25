// CheckboxGroup.tsx
import styles from "./CheckBox.module.scss";

export type CheckboxValue = {
    value: string;
    label: string;
};

export interface CheckboxGroupComponentProps {
    options: CheckboxValue[];                 // все варианты
    values: CheckboxValue[];                  // выбранные
    onChange: (selected: CheckboxValue[]) => void;
    className?: string;
    invalid?: boolean;
    disabled?: boolean;
}

function CheckboxGroupComponent(props: CheckboxGroupComponentProps) {
    const { options, values, onChange, className, invalid, disabled } = props;

    function handleToggle(item: CheckboxValue) {
        if (disabled) return;

        const exists = values.some((s) => s.value === item.value);
        const newSelected = exists
            ? values.filter((s) => s.value !== item.value)
            : [...values, item];

        onChange(newSelected);
    }

    function isChecked(v: string) {
        return values.some((s) => s.value === v);
    }

    return (
        <div
            className={[
                styles.group,
                invalid ? styles.invalid : "",
                disabled ? styles.disabled : "",
                className ?? "",
            ]
                .join(" ")
                .trim()}
        >
            {options.map((item) => (
                <label key={item.value} className={styles.item}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={isChecked(item.value)}
                        disabled={disabled}
                        onChange={() => handleToggle(item)}
                    />
                    <span className={styles.text}>{item.label}</span>
                </label>
            ))}
        </div>
    );
}

export interface CheckboxGroupProps
    extends Omit<CheckboxGroupComponentProps, "className" | "values"> {
    label: string;
    values: CheckboxValue[];
    className?: string;
}

export function Checkbox(props: CheckboxGroupProps) {
    const { label, className, ...rest } = props;

    return (
        <div className={[styles.wrapper, className ?? ""].join(" ").trim()}>
            <label className={styles.label}>{label}</label>
            <CheckboxGroupComponent {...rest} />
        </div>
    );
}
