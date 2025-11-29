import React, { useRef, useState } from "react";
import styles from "./FileUploader.module.scss";
import PhotoMiniature from "../PhotoMiniature/PhotoMiniature";

export default function FileUploader({
                                         mode = "multiple",
                                         files = [],
                                         onChange,
                                         onError,
                                         accept = ["image/jpeg", "image/png"]
                                     }) {
    const [internalError, setInternalError] = useState("");
    const fileInputRef = useRef(null);

    const showError = (msg) => {
        setInternalError(msg);
        onError && onError(msg);
    };

    /*──────────────────────────*/
    /*     Drag & Drop          */
    /*──────────────────────────*/
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add(styles.dragOver);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove(styles.dragOver);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove(styles.dragOver);

        const dropped = Array.from(e.dataTransfer.files);

        const selected = dropped.map((file) => ({
            file,
            camera: "root"
        }));

        handleFiles(selected);
        e.dataTransfer.clearData();
    };

    /*──────────────────────────*/
    /*       File Change        */
    /*──────────────────────────*/
    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files).map((file) => ({
            file,
            camera: "root"
        }));

        handleFiles(selected);
        e.target.value = null;
    };

    const checkFormat = (file) => accept.includes(file.type);

    const handleFiles = (selectedFiles) => {
        const valid = [];
        const invalid = [];

        selectedFiles.forEach(({ file, camera }) => {
            if (checkFormat(file)) valid.push({ file, camera });
            else invalid.push(file.name);
        });

        if (invalid.length) {
            showError(
                `Неверный формат: ${invalid.join(", ")}. Разрешено: ${accept.join(", ")}`
            );
        } else {
            setInternalError("");
        }

        if (!valid.length) return;

        let newFiles;
        if (mode === "single") newFiles = [valid[0]];
        else newFiles = [...files, ...valid];

        onChange && onChange(newFiles);
    };

    const deleteFile = (index) => {
        const updated = [...files];
        updated.splice(index, 1);
        onChange && onChange(updated);
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
