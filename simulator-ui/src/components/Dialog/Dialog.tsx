import { useEffect, useRef } from "react";
import styles from "./Dialog.module.scss";
import CloseIcon from "@mui/icons-material/Close";

interface DialogProps {
    type?: "info" | "warning" | "error";
    title?: string;
    text?: string;
    children?: React.ReactNode; // <-- вот это добавляем!
    onClose?: () => void;
}

export function Dialog({ type = "info", title, text, children, onClose }: DialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (dialog && !dialog.open) {
            dialog.showModal();
        }

        const handleCancel = (e: Event) => {
            e.preventDefault();
            onClose?.();
        };

        dialog?.addEventListener('cancel', handleCancel);

        return () => {
            dialog?.removeEventListener('cancel', handleCancel);
        };
    }, [onClose]);

    return (
        <dialog ref={dialogRef} className={`${styles.dialog} ${styles[type]}`}>
            <div className={styles.header}>
                {title && <h2 className={styles.title}>{title}</h2>}
                {onClose && (
                    <button className={styles.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </button>
                )}
            </div>
            <div className={styles.body}>
                {text && <p className={styles.text}>{text}</p>}
                {children} {/* <-- сюда выводим переданный JSX */}
            </div>
        </dialog>
    );
}
