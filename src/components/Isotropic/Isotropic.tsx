import { observer } from "mobx-react-lite";
import React, {useCallback, useRef, useState} from "react";
import styles from "./Isotropic.module.scss";
import {isotropicStore, isotropicStore as store} from "../../store/isotropicStore";
import { Dropdown } from "../Dropdown/Dropdown";
import { Button } from "../Button/Button";
import { Chart } from "../Chart/Chart";
import { Dialog } from "../Dialog/Dialog";
import {ValueList} from "../ValueList/ValueList.tsx";

export const Isotropic = observer(() => {
    // локальные флаги открытия диалогов
    const [fitOpen, setFitOpen] = useState(false);
    const [predictOpen, setPredictOpen] = useState(false);
    const [predictUploader, setPredictUploader] = useState(false);

    const selectFileFitRef = useRef<HTMLInputElement>(null);
    const selectFilePredictRef = useRef<HTMLInputElement>(null);
    // api.auth.loginCookieAuthLoginCookiePost({})


    // вариант модели и ошибки
    const modelOptions = [
        { value: "NeoHookean", label: "Нео Хукин" },
        { value: "MooneyRivlin", label: "Муни Ривлин" },
        { value: "GeneralizedMooneyRivlin", label: "Общий Муни Ривлин" },
        { value: "Beda", label: "Беда" },
        { value: "Yeoh", label: "Yeoh" },
        { value: "Gent", label: "Гент" },
        { value: "Carroll", label: "Кэррол" },
    ];


    // drag&drop
    const onDropFit = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length) store.setFitFiles(files);
    }, []);
    const onDragOverFit = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);
    const onSelectFileFit = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length) store.setFitFiles(files);
    }, []);


    const onDropPredict = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const file = e.dataTransfer.files?.[0]; // берём только первый
        if (file) {
            store.setPredictFile(file);
            e.dataTransfer.clearData();           // по желанию: очищаем буфер
        }
    }, [store]);

    const onDragOverPredict = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

// выбор файла через <input type="file">
    const onSelectFilePredict = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // берём только первый
        if (file) {
            store.setPredictFile(file);
            e.target.value = '';            // по желанию: сбрасываем input
        }
    }, [store]);

    // Функция Fit + открытие диалога
    const handleFit = async () => {
        await store.uploadAndFit();
        if (!store.error) {
            setFitOpen(true);
        }
    };
    // Функция Predict + открытие диалога
    const handlePredict = async () => {
        await store.predict();
        if (!store.error) {
            setPredictOpen(true);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Изотропная модель</h1>

            <div className={styles.formRow}>
                {/*<label>Hyperlastic Model:</label>*/}
                <Dropdown
                    label={'Гиперэластичная модель'}
                    options={modelOptions}
                    value={store.hyperlastic_model}
                    onChange={(v) => store.setHyperlasticModel(v as any)}
                />
            </div>

            {/*<div className={styles.formRow}>*/}
            {/*    <label>Error Function:</label>*/}
            {/*    <Dropdown*/}
            {/*        options={errorOptions}*/}
            {/*        value={store.error_function}*/}
            {/*        onChange={(v) => store.setErrorFunction(v as any)}*/}
            {/*    />*/}
            {/*</div>*/}

            <div
                className={styles.dropzone}
                onDrop={onDropFit}
                onDragOver={onDragOverFit}
                onClick={()=>{selectFileFitRef.current?.click()}}
            >
                {store.fitFiles.length > 0 ? (
                    <span>Файлы: {store.fitFiles.map((f) => f.name).join(", ")}</span>
                ) : (
                    <span>
            Перетащите файлы или{" нажмите сюда для выбора"}
                        <input ref={selectFileFitRef} style={{display: "none"}} type="file" multiple onChange={onSelectFileFit} />
          </span>
                )}
            </div>

            {store.error && <div className={styles.error}>{store.error}</div>}

            <div className={styles.buttons}>
                <Button
                    text="Upload & Fit"
                    onClick={handleFit}
                    disabled={!store.fitFiles.length || store.loading}
                />
                <Button
                    text="Predict"
                    onClick={() => {setPredictUploader(true)}}
                    disabled={store.loading || !store.fitPlotData}
                />
            </div>

            {store.loading && <div className={styles.loading}>Загрузка...</div>}

            {predictUploader && (
                <Dialog
                    onClose={() => setPredictUploader(false)}
                    title={'Загрузите файл'}
                >
                    <>
                    <div
                        className={styles.dropzone}
                        onDrop={onDropPredict}
                        onDragOver={onDragOverPredict}
                        onClick={() => {
                            selectFilePredictRef.current?.click()
                        }}
                    >
                        {store.predictFiles ? (
                            <span>Файл: {store.predictFiles.name}</span>
                        ) : (
                            <span>
            Перетащите файл или{"  нажмите сюда для выбора"}
                                <input ref={selectFilePredictRef} style={{display: "none"}} type="file"
                                       onChange={onSelectFilePredict}/>
          </span>
                        )}
                    </div>
                        <Button
                            onClick={() => {
                                setPredictUploader(false)
                                handlePredict().then()
                            }}
                        >
                            Predict
                        </Button>
                    </>
                </Dialog>

            )}

            {/* Диалог с графиком Fit */}
            {fitOpen && (
                <Dialog
                    type="info"
                    title="Fit Results"
                    onClose={() => setFitOpen(false)}
                >
                    <ValueList items={store.fitMetrics}/>

                </Dialog>
            )}

            {store.fitPlotData && (
                <>
                    <ValueList items={isotropicStore.fitParameters} title={'Параметры фиттирования'} tooltip={{content: 'test', link: 'https://artiebears.com'}}/>
                    <Chart
                        name={store.fitPlotData.name!}
                        x_label={store.fitPlotData.x_label!}
                        y_label={store.fitPlotData.y_label!}
                                lines={store.fitPlotData.lines!.map((ln) => ({
                                    name: ln.name!,
                                    data: { x: ln.x!, y: ln.y! },
                                }))}
                    />
                </>
                    )}

            {/* Диалог с графиком Predict */}
            {predictOpen && (
                <Dialog
                    type="info"
                    title="Predict Results"
                    onClose={() => setPredictOpen(false)}
                >
                    <ValueList items={store.fitMetrics} />

                </Dialog>
            )}

                   {store.predictPlotData && (
                       <Chart
                           name={store.predictPlotData.name!}
                           x_label={store.predictPlotData.x_label!}
                           y_label={store.predictPlotData.y_label!}
                           lines={store.predictPlotData.lines!.map((ln) => ({
                               name: ln.name!,
                               data: { x: ln.x!, y: ln.y! },
                           }))}
                       />
                   )}
            {store.predictPlotData && store.fitPlotData && (
                <Button onClick={async () => await store.downloadEnergy()} text="Download" />
            )}
            <Button onClick={async () => store.reset()} text={'Очистить'} variant={'warning'}/>

        </div>
    );
});
