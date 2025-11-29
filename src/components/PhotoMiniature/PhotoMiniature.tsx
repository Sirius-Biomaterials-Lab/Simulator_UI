import { useEffect, useState } from "react";
import styles from "./PhotoMiniature.module.scss";

const SUPPORTED_TYPES: string[] = [
    "image/jpeg",
    "image/png",
];

interface PhotoMiniatureProps {
    file: File;
    onRemove: () => void;
}

export default function PhotoMiniature({ file, onRemove }: PhotoMiniatureProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const isSupported = SUPPORTED_TYPES.includes(file.type);

    useEffect(() => {
        if (!file || !isSupported) {
            setPreview(null);
            return;
        }

        const url = URL.createObjectURL(file);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [file, isSupported]);

    return (
        <div className={styles.photoMiniature}>
            {isSupported && preview ? (
                <img src={preview} alt={file.name} className={styles.img} />
            ) : (
                <div className={styles.placeholder}>
                    <span>{file.name}</span>
                </div>
            )}

            <button className={styles.remove} onClick={onRemove}>
                ×
            </button>
        </div>
    );
}
