import { useEffect, useState } from "react";
import styles from "./PhotoPreview.module.scss";
import DownloadIcon from '@mui/icons-material/Download';

type PhotoPreviewProps = {
    file?: File | null;
    src?: string;
    downloadName?: string;
    description?: string;
};

export default function PhotoPreview({ file, src, downloadName = "image", description }: PhotoPreviewProps) {
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
        <div style={{display: 'flex', flexDirection: 'column'}}>
        <div className={styles.card}>
            <a className={styles.downloadBtn} href={preview} download={description}>
                <DownloadIcon />
            </a>

            <img src={preview} alt={downloadName} className={styles.img} />

        </div>
            {description && (
                <p style={{alignSelf: 'center'}}>{description}</p>
            )}
        </div>
    );
}
