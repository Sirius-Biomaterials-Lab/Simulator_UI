import { makeAutoObservable, runInAction } from "mobx";
import {
    BodyUploadModelModulesIsotropicUploadModelPost,
    PlotData,
    AnisotropicMetric, Metric,  Parameter         // ← метрики из сгенерённого клиента
} from "../api/api";
import {api} from "../api/apiWrapper.ts";


export type HyperlasticModelType =
    BodyUploadModelModulesIsotropicUploadModelPost["hyperlastic_model"];

export class IsotropicStore {
    /* ───────── form fields ───────── */
    hyperlastic_model: HyperlasticModelType = "MooneyRivlin";
    // error_function: ErrorFunctionType = "Absolute error in σ";
    fitFiles: File[] = [];
    predictFiles?: File = undefined;

    /* ───────── responses ───────── */
    fitPlotData: PlotData | null = null;
    predictPlotData: PlotData | null = null;
    fitMetrics: Metric[] | null = null;
    fitParameters: Parameter[] | null = null;
    predictMetrics: AnisotropicMetric[] | null = null;

    /* ───────── state ───────── */
    loading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    /* ===== setters ===== */
    setHyperlasticModel(model: HyperlasticModelType) {
        this.hyperlastic_model = model;
    }

    // setErrorFunction(fn: ErrorFunctionType) {
    //     this.error_function = fn;
    // }

    setFitFiles(files: File[]) {
        this.fitFiles = files;
        console.log(files);
    }

    setPredictFile(file: File) {
        this.predictFiles = file;
    }

    /* ===== actions ===== */
    async uploadAndFit() {
        if (!this.fitFiles.length) {
            this.error = "Требуется хотя бы один файл.";
            return;
        }

        this.loading = true;
        this.error = null;

        try {
            /* 1. Собираем FormData */
            const fd = new FormData();
            fd.append("hyperlastic_model", this.hyperlastic_model);
            this.fitFiles.forEach(f => fd.append("files", f, f.name));

            /* 2. POST /upload_model вручную */
            const uploadResp = await fetch(
                `${api.baseUrl}/modules/isotropic/upload_model`,
                { method: "POST", body: fd, credentials: "include" }
            );

            if (!uploadResp.ok) {
                const err = await uploadResp.json().catch(() => ({}));
                throw new Error(err?.detail || `Upload failed (${uploadResp.status})`);
            }

            /* 3. Фитим модель через клиент (возвращает {status, parameters, metrics, plot_data}) */
            const fit = await api.modules.fitModelModulesIsotropicFitPost({credentials: "include"});

            runInAction(() => {
                this.fitPlotData = fit.data.plot_data ?? null;
                this.fitMetrics = fit.data.metrics ?? null;
                this.fitParameters = fit.data.parameters ?? null;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error =
                    e?.message || e?.error?.detail || "Не удалось загрузить и обработать данные.";
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    async predict() {
        if (!this.fitPlotData) {
            this.error = "Fit must be performed before predict.";
            return;
        }

        this.loading = true;
        this.error = null;

        try {
            const fd = new FormData();
            if (!this.predictFiles) return
            fd.append("file", this.predictFiles, this.predictFiles.name);

            /* POST /predict вручную */
            const resp = await fetch(
                `${api.baseUrl}/modules/isotropic/predict`,
                { method: "POST", body: fd, credentials: "include" }
            );

            const data = await resp.json(); // {status, metrics, plot_data}

            runInAction(() => {
                this.predictPlotData = data.plot_data ?? null;
                this.predictMetrics = data.metrics ?? null;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e?.error?.detail || e?.message || "Failed to predict.";
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    async downloadEnergy() {
        // если уже идёт другая операция, можно выйти — по желанию
        // if (this.loading) return;

        this.loading = true;
        this.error = null;

        try {
            // 1. Запрашиваем строку энергии
            // const resp   = await api.modules.calculateEnergyModulesIsotropicCalculateEnergyGet();
            const resp   = await fetch(
                `${api.baseUrl}/modules/isotropic/calculate_energy`,
                // `${api.baseUrl}/metrics`,
                // `${api.baseUrl}/modules/isotropic/clear_data`,
                { method: "POST", credentials: "include" }
            );
            // console.log(await resp.text());
            const energy = await resp.text();               // тип — string

            // 2. Формируем файл
            const blob = new Blob([energy], {
                type: "text/plain;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);

            // 3. Триггерим скачивание
            const a = document.createElement("a");
            a.href = url;
            a.download = "isotrop.energy";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (e: any) {
            runInAction(() => {
                this.error =
                    e?.message || e?.error?.detail || "Не удалось скачать файл энергии.";
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    reset() {
        this.hyperlastic_model = "MooneyRivlin";
        // this.error_function = "Absolute error in σ";
        this.fitFiles = [];
        this.fitPlotData = null;
        this.predictPlotData = null;
        this.fitMetrics = null;
        this.predictMetrics = null;
        this.error = null;
    }
}

export const isotropicStore = new IsotropicStore();
