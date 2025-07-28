import {Api} from "./api.ts";

export const api = new Api({ baseUrl:  localStorage.getItem('backend-host') || import.meta.env.VITE_API_BASE_URL });
