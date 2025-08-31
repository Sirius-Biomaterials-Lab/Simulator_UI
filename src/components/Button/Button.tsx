import styles from "./Button.module.scss";

interface ButtonProps {
    text?: string;
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
    variant?: "primary" | "secondary";
}

export function Button({
                           text,
                           children,
                           onClick,
                           disabled = false,
                           active = false,
                           variant = "primary",
                       }: ButtonProps) {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${active ? styles.active : ""}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text || children}
        </button>
    );
}
