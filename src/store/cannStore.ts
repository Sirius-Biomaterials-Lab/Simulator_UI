import { makeAutoObservable, runInAction } from "mobx";
import {
    BodyUploadModelModulesCannUploadModelPost,
    PlotData,
    AnisotropicMetric, Metric, Parameter, ActivationFunction         // ← метрики из сгенерённого клиента
} from "../api/api";
import {api} from "../api/apiWrapper.ts";


export type CannModelType =
    BodyUploadModelModulesCannUploadModelPost["model_type"];

export type ActivationFunctions = BodyUploadModelModulesCannUploadModelPost['activation_functions']
export type InitAlpha = number | null

export class CannStore {
    /* ───────── form fields ───────── */
    modelType: CannModelType = "isotropic";
    activationFunctions: ActivationFunctions = [ActivationFunction.Exp];
    initAlpha: InitAlpha = 0.5
    eporchs: number = 1000
    polynomialDegree: number = 3
    batchSize: number = 8
    // error_function: ErrorFunctionType = "Absolute error in σ";
    fitFiles: File[] = [];
    predictFiles?: File = undefined;

    /* ───────── responses ───────── */
    fitPlotData: PlotData[] | null = null;
    predictPlotData: PlotData | null = null;
    fitMetrics: Metric[] | null = null;
    fitParameters: Parameter[] | null = null;
    predictMetrics: AnisotropicMetric[] | null = null;
    correlationId: string ='';

    /* ───────── state ───────── */
    loading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    /* ===== setters ===== */
    setModelType(model: CannModelType) {
        this.modelType = model;
    }
    setActivationFunctions(functions: ActivationFunctions) {
        this.activationFunctions = functions;
    }
    setInitAlpha(initAlpha: string | null) {
        this.initAlpha = Number(initAlpha);
    }
    setEporchs(eporchs: string) {
        this.eporchs = Number(eporchs);
    }
    setPolynomialDegree(degree: string) {
        this.polynomialDegree = Number(degree);
    }
    setBatchSize(batchSize: string) {
            this.batchSize =Number( batchSize);
    }


    setFitFiles(files: File[]) {
        this.fitFiles = files;
        console.log(files);
    }

    // setPredictFile(file: File) {
    //     this.predictFiles = file;
    // }

    // можно оставить как утилиту
    private sleep(ms: number) {
        return new Promise(res => setTimeout(res, ms));
    }

    async responseFitParams(): Promise<{ ok: boolean; ready: boolean; status?: string | null }> {
        try {
            const fit = await api.modules.getResultModulesCannGetResultPost({correlation_id: this.correlationId},{ credentials: "include" });

            runInAction(() => {
                this.fitPlotData   = fit?.data?.plot_data   ?? null;
                this.fitMetrics    = fit?.data?.metrics     ?? null;
                this.fitParameters = fit?.data?.parameters  ?? null;
            });

            const ready =
                fit?.data?.status === "ready" ||
                Boolean(fit?.data?.parameters || fit?.data?.metrics || fit?.data?.plot_data);

            return { ok: true, ready, status: fit?.data?.status ?? null };
        } catch {
            return { ok: false, ready: false, status: null };
        }
    }

// 🔁 простой пуллинг раз в 10 секунд (по умолчанию до 10 минут)
    async pollFitResultEvery10s(maxMinutes = 10): Promise<"ready" | "timeout" | "failed"> {
        const maxTries = Math.floor((maxMinutes * 60) / 10); // одно обращение каждые 10 сек
        for (let i = 0; i < maxTries; i++) {
            const { ok, ready, status } = await this.responseFitParams();

            if (ok) {
                if (status === "failed") return "failed";
                if (ready) return "ready";
            }

            await this.sleep(10_000); // 10 секунд
        }
        return "timeout";
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
            fd.append("model_type", this.modelType);
            // @ts-ignore
            fd.append("activation_functions", this.activationFunctions);
            fd.append("polynomial_degree", String(this.polynomialDegree));
            fd.append("init_alpha", `${this.initAlpha}`);
            fd.append("epochs", `${this.eporchs}`);
            fd.append("batch_size", `${this.batchSize}`);
            this.fitFiles.forEach(f => fd.append("files", f, f.name));

            /* 2. POST /upload_model вручную */
            const uploadResp = await fetch(
                `${api.baseUrl}/modules/cann/upload_model`,
                { method: "POST", body: fd, credentials: "include" }
            );

            if (!uploadResp.ok) {
                const err = await uploadResp.json().catch(() => ({}));
                throw new Error(err?.detail || `Upload failed (${uploadResp.status})`);
            }



            /* 3. Фитим модель через клиент (возвращает {status, parameters, metrics, plot_data}) */
            const res = await api.modules.fitModelModulesCannFitPost({credentials: "include"});
            this.correlationId = res.data.correlation_id
            const finalStatus = await this.pollFitResultEvery10s(10); // ждём до ~10 минут

            if (finalStatus === "failed") throw new Error("Модель завершилась с ошибкой (status=failed).");
            if (finalStatus === "timeout") throw new Error("Истек таймаут ожидания результата.");

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

    async downloadEnergy() {
        // если уже идёт другая операция, можно выйти — по желанию
        // if (this.loading) return;

        this.loading = true;
        this.error = null;

        try {
            // 1. Запрашиваем строку энергии
            // const resp   = await api.modules.calculateEnergyModulesIsotropicCalculateEnergyGet();
            const resp   = await fetch(
                `${api.baseUrl}/modules/cann/calculate_energy`,
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

    async reset() {
        await api.modules.clearAllDataModulesCannClearDataDelete({credentials: "include"});

        this.modelType = "isotropic";
        this.activationFunctions = []
        this.initAlpha = null
        this.eporchs = 1000
        this.batchSize = 8
        // this.error_function = "Absolute error in σ";
        this.fitFiles = [];
        this.fitPlotData = null;
        this.predictPlotData = null;
        this.fitMetrics = null;
        this.predictMetrics = null;
        this.error = null;
    }
}

export const cannStore = new CannStore();
