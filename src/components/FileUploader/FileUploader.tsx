import React, { useRef, useState } from "react";
import styles from "./FileUploader.module.scss";
import PhotoMiniature from "../PhotoMiniature/PhotoMiniature";

/*──────────────────────────*/
/*       Типы данных        */
/*──────────────────────────*/
export type TUploadedFile = {
    file: File;
};

export type FileUploaderMode = "single" | "multiple";

export interface FileUploaderProps {
    mode?: FileUploaderMode;
    files?: TUploadedFile[];
    onChange?: (files: TUploadedFile[]) => void;
    onError?: (msg: string) => void;
    accept?: string[]; // MIME-тип: ["image/jpeg", "image/png"]
}

export default function FileUploader({
                                         mode = "multiple",
                                         files = [],
                                         onChange,
                                         onError,
                                         accept = ["image/jpeg", "image/png"]
                                     }: FileUploaderProps) {
    const [internalError, setInternalError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const showError = (msg: string) => {
        setInternalError(msg);
        if (onError) onError(msg);
    };

    /*──────────────────────────*/
    /*     Drag & Drop          */
    /*──────────────────────────*/
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add(styles.dragOver);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove(styles.dragOver);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove(styles.dragOver);

        const dropped = Array.from(e.dataTransfer.files);

        const selected: TUploadedFile[] = dropped.map((file) => ({
            file,
        }));

        handleFiles(selected);
        e.dataTransfer.clearData();
    };

    /*──────────────────────────*/
    /*       File Change        */
    /*──────────────────────────*/
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const list = e.target.files ? Array.from(e.target.files) : [];
        const selected: TUploadedFile[] = list.map((file) => ({
            file,
        }));

        handleFiles(selected);
        e.target.value = "";
    };

    const checkFormat = (file: File) => accept.includes(file.type);

    const handleFiles = (selectedFiles: TUploadedFile[]) => {
        const valid: TUploadedFile[] = [];
        const invalid: string[] = [];

        selectedFiles.forEach(({ file }) => {
            if (checkFormat(file)) valid.push({ file });
            else invalid.push(file.name);
        });

        if (invalid.length) {
            showError(
                `Неверный формат: ${invalid.join(", ")}. Разрешено: ${accept.join(", ")}`
            );
        } else {
            setInternalError("");
        }

        if (valid.length === 0) return;

        let newFiles: TUploadedFile[];

        if (mode === "single") {
            newFiles = [valid[0]];
        } else {
            newFiles = [...files, ...valid];
        }

        if (onChange) onChange(newFiles);
    };

    const deleteFile = (index: number) => {
        const updated = [...files];
        updated.splice(index, 1);
        if (onChange) onChange(updated);
    };

    return (
        <div>
            <div
                className={styles.dragDropField}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <i className="fa-regular fa-file-image fa-3x"></i>

                <p>
                    Перетащите изображения сюда <br />
                    или <span className="text-warning">кликните для выбора</span>
                </p>

                <div className={styles.extensions}>
                    Изображения (JPEG, PNG, TIFF)
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept.join(",")}
                    multiple={mode === "multiple"}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
            </div>

            {internalError && <p className={styles.error}>{internalError}</p>}

            <div className={styles.uploadedList}>
                {files.map(({ file }, index) => (
                    <PhotoMiniature
                        key={index}
                        file={file}
                        onRemove={() => deleteFile(index)}
                    />
                ))}
            </div>
        </div>
    );
}
