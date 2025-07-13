import { makeAutoObservable, runInAction } from "mobx";
import { BodyUploadModelModulesIsotropicUploadModelPost, PlotData } from "../api/api";
import { Api as RealApi } from "../api/api";

// Choose between real and mock API based on env
// const api = useMocks
//     ? new MockApi()
//     : new RealApi({ baseUrl: import.meta.env.VITE_API_BASE_URL });

const api = new RealApi({baseUrl: "https://616d098b13bf.ngrok-free.app"});

export type HyperlasticModelType = BodyUploadModelModulesIsotropicUploadModelPost["hyperlastic_model"];
export type ErrorFunctionType = BodyUploadModelModulesIsotropicUploadModelPost["error_function"];

export class IsotropicStore {
    // form fields
    hyperlastic_model: HyperlasticModelType = "MooneyRivlin";
    error_function: ErrorFunctionType = "Absolute error in σ";
    files: File[] = [];

    // responses
    fitResponse: PlotData | null = null;
    predictResponse: PlotData | null = null;

    // state
    loading: boolean = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setHyperlasticModel(model: HyperlasticModelType) {
        this.hyperlastic_model = model;
    }

    setErrorFunction(fn: ErrorFunctionType) {
        this.error_function = fn;
    }

    setFiles(files: File[]) {
        this.files = files;
        console.log(this.files)
    }

    async uploadAndFit() {
        if (!this.files.length) {
            this.error = "Требуется хотя бы один файл.";
            return;
        }

        this.loading = true;
        this.error   = null;

        try {
            /* --- 1. Собираем настоящий FormData --- */
            const fd = new FormData();
            fd.append("hyperlastic_model", this.hyperlastic_model);
            // fd.append("error_function",   this.error_function);
            this.files.forEach(f => fd.append("files", f, f.name));

            /* --- 2. Ручной POST без Content-Type --- */
            const uploadResp = await fetch(
                `${api.baseUrl}/modules/isotropic/upload_model`,
                { method: "POST", body: fd }
            );

            if (!uploadResp.ok) {
                // пробуем достать detail, иначе просто текст
                const err = await uploadResp.json().catch(() => ({}));
                throw new Error(err?.detail || `Upload failed (${uploadResp.status})`);
            }

            /* --- 3. Фитим как раньше через сгенерированный клиент --- */
            const fit = await api.modules.fitModelModulesIsotropicFitPost();

            runInAction(() => {
                this.fitResponse = fit.data.plot_data ?? null;
            });

        } catch (e: any) {
            runInAction(() => {
                this.error =
                    e?.message || e?.error?.detail || "Не удалось загрузить и обработать данные.";
            });
        } finally {
            runInAction(() => { this.loading = false; });
        }
    }

    async predict() {
        if (!this.fitResponse) {
            this.error = "Fit must be performed before predict.";
            return;
        }
        this.loading = true;
        this.error = null;
        try {
            const response = await api.modules.predictModelModulesIsotropicPredictPost();
            runInAction(() => {
                this.predictResponse = response.data.plot_data || null;
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

    reset() {
        this.hyperlastic_model = "Mooney Rivlin";
        this.error_function = "Absolute error in σ";
        this.files = [];
        this.fitResponse = null;
        this.predictResponse = null;
        this.error = null;
    }
}

export const isotropicStore = new IsotropicStore();
