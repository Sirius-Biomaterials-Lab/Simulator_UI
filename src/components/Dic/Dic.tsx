import { observer } from "mobx-react-lite";
import React from "react";
import styles from "./Dic.module.scss";

import {
    dicStore as store,
    TypeCurveOptions,
    TCurveType,
    TGeneratedImage
} from "../../store/dicStore";

import { Button } from "../Button/Button";
import FileUploader from "../FileUploader/FileUploader";
import { Dropdown } from "../Dropdown/Dropdown";
import { InputNumber } from "../InputNumber/InputNumber";
import PhotoPreview from "../PhotoPreview/PhotoPreview.tsx";

export const Dic: React.FC = observer(() => {

    const handleUpload = async () => {
        await store.uploadFiles();
    };

    const handleGetImages = async () => {
        await store.downloadImages();
    };

    const handleDownloadCsv = async () => {
        await store.downloadCsvData();
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>DIC Анализ</h1>

            {/* Тип кривой */}
            <div className={styles.formRow}>
                <Dropdown
                    label="Тип кривой"
                    options={TypeCurveOptions}
                    value={store.files.type_curve}
                    onChange={(value: string) => {
                        store.setTypeCurve(value as TCurveType);
                    }}
                />
            </div>

            {/* Deg E */}
            <div className={styles.formRow}>
                <InputNumber
                    value={String(store.files.deg_e)}
                    label="Степень полинома в направлении y"
                    placeholder="Показатель степени"
                    numberType="int"
                    onChange={(value: string | null) => {
                        if (value !== null) store.setDegE(Number(value));
                    }}
                />
            </div>

            {/* Deg N */}
            <div className={styles.formRow}>
                <InputNumber
                    value={String(store.files.deg_n)}
                    label="Степень полинома в направлении x"
                    placeholder="Показатель степени"
                    numberType="int"
                    onChange={(value: string | null) => {
                        if (value !== null) store.setDegN(Number(value));
                    }}
                />
            </div>

            {/* Reference */}
            <div className={styles.uploadRow}>
                <div className={styles.column}>
                    <h3 className={styles.uploaderLabel}>Референс (1 изображение)</h3>
                    <FileUploader
                        mode="single"
                        files={
                            store.files.reference
                                ? [{ file: store.files.reference }]
                                : []
                        }
                        onChange={(arr) => {
                            if (arr[0]?.file) store.setReference(arr[0].file);
                        }}
                        accept={["image/jpeg", "image/png", "image/tiff"]}
                    />
                </div>

                {/* Deformed */}
                <div className={styles.column}>
                    <h3 className={styles.uploaderLabel}>Деформации (до 30 изображений)</h3>
                    <FileUploader
                        mode="multiple"
                        files={store.files.deformed.map((file) => ({ file }))}
                        onChange={(arr) => {
                            store.setDeformed(arr.map((x) => x.file));
                        }}
                        accept={["image/jpeg", "image/png", "image/tiff"]}
                    />
                </div>
            </div>

            {/* Error */}
            {store.error && (
                <div className={styles.error}>{store.error}</div>
            )}

            {/* Buttons */}
            <div className={styles.buttons}>
                <Button
                    text="Загрузить на анализ"
                    onClick={handleUpload}
                    disabled={
                        !store.files.reference ||
                        store.files.deformed.length === 0 ||
                        store.loading
                    }
                />

                <Button
                    text="Получить результаты"
                    onClick={handleGetImages}
                    disabled={store.loading || !store.uploadSuccess}
                />

                <Button
                    text="Скачать .csv"
                    onClick={handleDownloadCsv}
                    disabled={store.loading || !store.uploadSuccess}
                />
            </div>

            {store.loading && (
                <div className={styles.loading}>Загрузка...</div>
            )}

            {/* Generated Images */}
            <div className={styles.resultsGrid}>
                {store.generatedImages.map(
                    (img: TGeneratedImage, i: number) => (
                        <PhotoPreview
                            key={i}
                            src={`data:image/png;base64,${img.base64_data}`}
                            downloadName={`generated_${i}.png`}
                        />
                    )
                )}
            </div>
        </div>
    );
});
