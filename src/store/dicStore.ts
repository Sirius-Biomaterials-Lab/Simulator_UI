import { makeAutoObservable, runInAction } from "mobx";
import { api } from "../api/apiWrapper";

/*───────────────────────────────*/
/*             TYPES             */
/*───────────────────────────────*/

export const TypeCurveOptions = [
    { value: "q4", label: "Полином 4 степени" },
    { value: "spline", label: "Сплайн" },
];

export type TCurveType = "q4" | "spline";

export type TGeneratedImage = {
    base64_data: string;
    title: string;
};

export type TFiles = {
    reference: File | null;
    deformed: File[];
    type_curve: TCurveType;
    deg_e: number;
    deg_n: number;
};

/*───────────────────────────────*/
/*            STORE              */
/*───────────────────────────────*/

export class DicStore {
    files: TFiles = {
        reference: null,
        deformed: [],
        type_curve: "q4",
        deg_e: 3,
        deg_n: 3,
    };

    generatedImages: TGeneratedImage[] = [];
    loading: boolean = false;
    error: string | null = null;
    uploadSuccess: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    /*───────────────────────────────*/
    /*           SETTERS             */
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

    setReference(file: File) {
        this.files.reference = file;
    }

    setDeformed(files: File[]) {
        this.files.deformed = files;
    }

    setParams(params: Partial<Pick<TFiles, "type_curve" | "deg_e" | "deg_n">>) {
        if (params.type_curve !== undefined) this.files.type_curve = params.type_curve;
        if (params.deg_e !== undefined) this.files.deg_e = params.deg_e;
        if (params.deg_n !== undefined) this.files.deg_n = params.deg_n;
    }

    setLoading(b: boolean) {
        this.loading = b;
    }

    setError(msg: string | null) {
        this.error = msg;
    }

    /*───────────────────────────────*/
    /*        API: UPLOAD FILES      */
    /*───────────────────────────────*/
    async uploadFiles(): Promise<Response | undefined> {
        this.setLoading(true);
        this.setError(null);

        try {
            const formData = new FormData();

            formData.append("type_curve", this.files.type_curve);
            formData.append("deg_e", this.files.deg_e.toString());
            formData.append("deg_n", this.files.deg_n.toString());

            if (this.files.reference) {
                formData.append("reference", this.files.reference);
            }

            this.files.deformed.forEach((f) => {
                formData.append("deformed", f);
            });

            const response = await fetch(
                `${api.baseUrl}/modules/dic/dic/analyze-series`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                }
            );

            this.uploadSuccess = true;
            return response;
        } catch (err) {
            console.error("uploadFiles error:", err);
            this.setError("Ошибка отправки данных на сервер");
        } finally {
            this.setLoading(false);
        }
    }

    /*───────────────────────────────*/
    /*   API: GET GENERATED IMAGES   */
    /*───────────────────────────────*/
    async downloadImages() {
        this.setLoading(true);
        this.setError(null);

        try {
            const response = await api.modules.getGeneratedImagesModulesDicGetImagesPost({
                credentials: "include",
            });

            runInAction(() => {
                this.generatedImages = (response.data?.images ?? []) as TGeneratedImage[];
            });

            return response;
        } catch (err) {
            console.error("downloadImages error:", err);
            this.setError("Ошибка получения изображений");
        } finally {
            this.setLoading(false);
        }
    }

    /*───────────────────────────────*/
    /*        DOWNLOAD CSV           */
    /*───────────────────────────────*/
    async downloadCsvData() {
        this.setLoading(true);
        this.setError(null);

        try {
            const resp = await api.modules.downloadCsvModulesDicGetCsvPost({
                credentials: "include",
            });

            const energy = await resp.text();

            const blob = new Blob([energy], {
                type: "text/plain;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);

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
                this.setLoading(false);
            });
        }
    }
}

export const dicStore = new DicStore();
