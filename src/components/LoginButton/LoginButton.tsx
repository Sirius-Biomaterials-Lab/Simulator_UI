import { Button } from "../Button/Button";
import { api } from "../../api/apiWrapper";

export function LoginButton() {
    const login = async () => {
        const username = prompt("Введите логин:");
        const password = prompt("Введите пароль:");

        if (!username || !password) {
            alert("Логин и пароль обязательны");
            return;
        }

        const basic = btoa(`${username}:${password}`);

        try {
            await api.auth.loginCookieAuthLoginCookiePost({
                headers: { Authorization: `Basic ${basic}` },
                credentials: "include", // важно для кук
            });
            alert(`Добро пожаловать, ${username}`);
        } catch (e) {
            console.error(e);
            alert("Ошибка входа");
        }
    };

    return <Button text="Войти" onClick={login} />;
}
