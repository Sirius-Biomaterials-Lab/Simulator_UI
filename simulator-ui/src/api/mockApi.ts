import { PlotData } from "./api";

export class MockApi {
    models = {
        uploadModelModelsIsotropicUploadModelPost: async () => {
            // ничего не делаем
            return { data: { status: "ok" } };
        },
        fitModelModelsIsotropicFitPost: async () => {
            const mock: PlotData = {
                name: "Mock fit",
                x_label: "strain",
                y_label: "stress",
                lines: [
                    { name: "mock", x: [0,1,2], y: [0,1,4] }
                ],
            };
            return { data: { plot_data: mock, status: "ok", metrics: [], parameters: [] } };
        },
        predictModelModelsIsotropicPredictPost: async () => {
            const mock: PlotData = {
                name: "Mock predict",
                x_label: "strain",
                y_label: "stress",
                lines: [
                    { name: "mock", x: [0,1,2], y: [0,2,8] }
                ],
            };
            return { data: { plot_data: mock, status: "ok" } };
        },
        // …остальные методы если надо
    };
}
