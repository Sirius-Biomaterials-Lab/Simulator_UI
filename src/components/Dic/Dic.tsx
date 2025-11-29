import { observer } from "mobx-react-lite";
import React, { useCallback, useRef, useState } from "react";
import styles from "./Dic.module.scss";
import {dicStore as store, TypeCurveOptions} from "../../store/DicStore";
import { Button } from "../Button/Button";
import PhotoPreview from "../photoPreview/PhotoPreview";
import FileUploader from "../FileUploader/FileUploader.tsx";
import {Dropdown} from "../Dropdown/Dropdown.tsx";
import {InputNumber} from "../InputNumber/InputNumber.tsx";

export const Dic = observer(() => {



    const handleUpload = async () => {
        await store.uploadFiles();
    };

    const handleGetImages = async () => {
        await store.downloadImages();
    };

    const handleDownloadCsv = async ()  => {
        await store.downloadCsvData()
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>DIC Анализ</h1>
            <div className={styles.formRow}>

                <Dropdown
                    label={'Тип кривой'}
                    options={TypeCurveOptions}
                    value={store.files.type_curve}
                    onChange={(v) => store.setTypeCurve(v as any)}
                />
            </div>
                <div className={styles.formRow}>

                    <InputNumber
                        value={String(store.files.deg_e)}
                        label={'Степень E'}
                        placeholder={'2, 4, 8, 16, ...'}
                        onChange={(value: string | null) => {
                            if (value !== null) {
                                store.setDegE(value)
                            }
                        }}
                        numberType={'int'}
                    />
                </div>
                    <div className={styles.formRow}>

                        <InputNumber
                            value={String(store.files.deg_n)}
                            label={'Степень N'}
                            placeholder={'2, 4, 8, 16, ...'}
                            onChange={(value: string | null) => {
                                if (value !== null) {
                                    store.setDegN(value)
                                }
                            }}
                            numberType={'int'}
                        />
                    </div>

                        {/* Reference */}
                        <div className={styles.uploadRow}>
                            <div className={styles.column}>
                                <h3 className={styles.uploaderLabel}>Референс (1 изображение)</h3>
                                <FileUploader
                                    mode="single"
                                    files={store.files.reference ? [{file: store.files.reference}] : []}
                                    onChange={(arr) => store.setReference(arr[0].file)}
                                    accept={["image/jpeg", "image/png", "image/tiff"]}
                                />
                            </div>

                            <div className={styles.column}>
                                <h3 className={styles.uploaderLabel}>Деформации (до 30 изображений)</h3>
                                <FileUploader
                                    mode="multiple"
                                    files={store.files.deformed.map((file) => ({file}))}
                                    onChange={(arr) => store.setDeformed(arr.map((x) => x.file))}
                                    accept={["image/jpeg", "image/png", "image/tiff"]}
                                />
                            </div>
                        </div>


                        {store.error && <div className={styles.error}>{store.error}</div>}

                        <div className={styles.buttons}>
                            <Button
                                text="Загрузить на анализ"
                                onClick={handleUpload}
                                disabled={!store.files.reference || store.files.deformed.length === 0 || store.loading}
                            />
                            <Button
                                text="Получить результаты"
                                onClick={handleGetImages}
                                disabled={store.loading || !store.uploadSuccess}
                            />
                            <Button
                                text={"Скачать .csv"}
                                onClick={handleDownloadCsv}
                                disabled={store.loading || !store.uploadSuccess}
                            />


                        </div>

                        {store.loading && <div className={styles.loading}>Загрузка...</div>}

                        {/* Показываем сгенерированные изображения */}
                        <div className={styles.resultsGrid}>
                            {store.generatedImages.map((img64, i) => (
                                <PhotoPreview
                                    key={i}
                                    src={`data:image/png;base64,${img64.base64_data}`}
                                    downloadName={`generated_${i}.png`}
                                />
                            ))}
                        </div>


                    </div>
                    );
                    });
