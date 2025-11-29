import React, { useEffect, useState } from "react";
import styles from "./PhotoPreview.module.scss";
import DownloadIcon from '@mui/icons-material/Download';

type PhotoPreviewProps = {
    file?: File | null;
    src?: string;
    downloadName?: string;
};

export default function PhotoPreview({ file, src, downloadName = "image" }: PhotoPreviewProps) {
    const [preview, setPreview] = useState("");

    useEffect(() => {
        if (src) {
            setPreview(src);
            return;
        }

        if (!file) return;

        const url = URL.createObjectURL(file);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [file, src]);

    if (!preview) return null;

    return (
        <div className={styles.card}>
            <a className={styles.downloadBtn} href={preview} download={downloadName}>
                <DownloadIcon />
            </a>

            <img src={preview} alt={downloadName} className={styles.img} />
        </div>
    );
}
