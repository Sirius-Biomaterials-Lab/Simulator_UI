import { makeAutoObservable, runInAction } from "mobx";
import { api } from "../api/apiWrapper";

export const TypeCurveOptions = [
    { value: 'q4', label: 'Полином 4 степени'},
    { value: 'spline', label: 'Сплайн'},
]

type TCurveType = 'q4' | 'spline';

export class DicStore {
    files = {
        reference: null,
        deformed: [],
        type_curve: "q4",
        deg_e: 3,
        deg_n: 3,
    };

    generatedImages = [];
    loading = false;
    error = null;
    uploadSuccess = false;

    constructor() {
        makeAutoObservable(this);
    }

    /*───────────────────────────────*/
    /*         SETTERS               */
    /*───────────────────────────────*/
    setTypeCurve(typeCurve: TCurveType) {
        this.files.type_curve = typeCurve;
    }

    setDegE(degE: number) {
        this.files.deg_e = degE;
    }

    setDegN(degN: number) {
        this.files.deg_n = degN;
    }

    setReference(file) {
        this.files.reference = file;
    }

    setDeformed(files) {
        this.files.deformed = files;
    }

    setParams({ type_curve, deg_e, deg_n }) {
        if (type_curve) this.files.type_curve = type_curve;
        if (deg_e !== undefined) this.files.deg_e = deg_e;
        if (deg_n !== undefined) this.files.deg_n = deg_n;
    }

    setLoading(b) {
        this.loading = b;
    }

    setError(msg) {
        this.error = msg;
    }

    /*───────────────────────────────*/
    /*       API: UPLOAD FILES       */
    /*───────────────────────────────*/
    async uploadFiles() {
        this.setLoading(true);
        this.setError(null);

        try {
            const formData = new FormData();

            formData.append("type_curve", this.files.type_curve);
            formData.append("deg_e", this.files.deg_e.toString());
            formData.append("deg_n", this.files.deg_n.toString());
            formData.append("reference", this.files.reference);

            this.files.deformed.forEach((f) => {
                formData.append("deformed", f);
            });

            // const response = await api.modules.analyzeSeriesModulesDicDicAnalyzeSeriesPost(formData, {});
            const response = await fetch(
                `${api.baseUrl}/modules/dic/dic/analyze-series`,
                { method: "POST", body: formData, credentials: "include" }
            );
            console.log("analyze-series response:", response);
            this.uploadSuccess = true;

            // Логики нет — ручка просто запускает процесс,
            // а затем надо отдельно получать изображения.
            return response;
        } catch (err) {
            console.error("uploadFiles error:", err);
            this.setError("Ошибка отправки данных на сервер");
        } finally {
            this.setLoading(false);
        }
    }

    /*───────────────────────────────*/
    /*    API: GET GENERATED IMAGES   */
    /*───────────────────────────────*/
    async downloadImages() {
        this.setLoading(true);
        this.setError(null);

        try {
            const response = await api.modules.getGeneratedImagesModulesDicGetImagesPost({credentials: 'include'});

            runInAction(() => {
                this.generatedImages = response.data.images || [];
            });

            console.log("get-images response:", response);

            return response;
        } catch (err) {
            console.error("downloadImages error:", err);
            this.setError("Ошибка получения изображений");
        } finally {
            this.setLoading(false);
        }
    }

    async downloadCsvData() {
        // если уже идёт другая операция, можно выйти — по желанию
        // if (this.loading) return;

        this.setLoading(true);
        this.setError(null);

        try {
            // 1. Запрашиваем строку энергии
            // const resp   = await api.modules.calculateEnergyModulesIsotropicCalculateEnergyGet();
            const resp   = await api.modules.downloadCsvModulesDicGetCsvPost({credentials: 'include'});
            const energy = await resp.text();               // тип — string

            // 2. Формируем файл
            const blob = new Blob([energy], {
                type: "text/plain;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);

            // 3. Триггерим скачивание
            const a = document.createElement("a");
            a.href = url;
            a.download = "result.csv";
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
                this.setLoading(false)
            });
        }
    }
}

export const dicStore = new DicStore();
