import {Button} from "../Button/Button.tsx";
import {api} from "../../api/apiWrapper.ts";

export function LoginButton() {

    const login =async  () => {
        await api.auth.loginCookieAuthLoginCookiePost({}).then()
    }

    return (
       <Button text={"Войти"} onClick={login}/>
    );
}