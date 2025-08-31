import {Api} from "./api.ts";
// login
export const api = new Api({ baseUrl:  localStorage.getItem('backend-host') || import.meta.env.VITE_API_BASE_URL });
