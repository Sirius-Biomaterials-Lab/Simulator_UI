// src/stores/authStore.ts
import { makeAutoObservable, runInAction } from "mobx";
import {Api as RealApi} from "../api/api.ts";

const api = new RealApi({baseUrl: ""});

export interface IUser {
    username: string;
    // добавьте поля, если бекенд возвращает больше
}

class AuthStore {
    user: IUser | null = null;
    loading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    /** True, если пользователь залогинен */
    get isAuthenticated() {
        return !!this.user;
    }

    /** Логин через cookie-endpoint */
    async login(username: string, password: string) {
        this.loading = true;
        this.error = null;
        try {
            await api.auth.loginCookieAuthLoginCookiePost({
                // body: { username, password },
                credentials: "include",      // важно для cookie
            });

            // 👉 при необходимости сделайте второй запрос /me, чтобы получить полную инфу о пользователе
            runInAction(() => {
                this.user = { username };
                this.loading = false;
            });
        } catch (err: any) {
            runInAction(() => {
                this.error = err?.message ?? "Login failed";
                this.loading = false;
            });
            throw err;
        }
    }

    /** Выход */
    async logout() {
        try {
            await api.auth.logoutCookieAuthLogoutCookieGet({ credentials: "include" });
        } finally {
            runInAction(() => {
                this.user = null;
            });
        }
    }
}

export const authStore = new AuthStore();
