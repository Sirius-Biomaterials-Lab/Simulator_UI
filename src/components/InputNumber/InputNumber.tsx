import React from "react";
import styles from "./InputNumber.module.scss";

type NumberType = "int" | "float";

interface InputNumberComponentProps {
    value: number | null;
    onChange: (val: number | null) => void;
    numberType?: NumberType;
    placeholder?: string;
    className?: string;               // можно дополнительно переопределить
    validate?: (val: number) => boolean;
    disabled?: boolean;
    invalid?: boolean;                // опционально — принудительно подсветить ошибку
}

export const InputNumberComponent: React.FC<InputNumberComponentProps> = ({
                                                                              value,
                                                                              onChange,
                                                                              numberType = "float",
                                                                              placeholder,
                                                                              className,
                                                                              validate,
                                                                              disabled = false,
                                                                              invalid,
                                                                          }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let raw = e.target.value;
        let parsed: number | null = null;

        if (numberType === "int") {
            raw = raw.replace(/[^\d-]/g, "");
            if (raw !== "" && !isNaN(Number(raw))) {
                parsed = parseInt(raw, 10);
            }
        } else {
            raw = raw.replace(",", ".");
            const floatVal = parseFloat(raw);
            if (!isNaN(floatVal)) {
                parsed = floatVal;
            }
        }

        if (parsed !== null && validate && !validate(parsed)) {
            onChange(null);
        } else {
            onChange(parsed);
        }
    };

    return (
        <div className={styles.wrapper}>
            <input
                type="text"
                value={value ?? ""}
                placeholder={placeholder}
                disabled={disabled}
                onChange={handleChange}
                className={[
                    styles.input,
                    invalid ? styles.invalid : "",
                    className ?? "",
                ].join(" ").trim()}
            />
        </div>
    );
};

// ---- Обёртка с label ----

interface InputNumberProps extends Omit<InputNumberComponentProps, "className"> {
    label: string;
    className?: string; // класс на корневой обёртке
}

export const InputNumber: React.FC<InputNumberProps> = ({
                                                            label,
                                                            className,
                                                            ...props
                                                        }) => {
    return (
        <div className={[styles.wrapper, className ?? ""].join(" ").trim()}>
            <label className={styles.label}>{label}</label>
            <InputNumberComponent {...props} />
        </div>
    );
};
