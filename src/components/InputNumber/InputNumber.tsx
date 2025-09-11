import React from "react";
import styles from "./InputNumber.module.scss";

type NumberType = "int" | "float";

interface InputNumberComponentProps {
    value: string | null;
    onChange: (val: string | null) => void;
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
        console.log('test',raw)
        if (numberType === "int") {
            raw = raw.replace(/[^\d-]/g, "");
            onChange(raw)
        } else {
            console.log('here')
            raw = raw.replace(",", ".");
        }

        if (parsed !== null && validate && !validate(parsed)) {
            onChange(null);
        } else {
            onChange(raw);
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
