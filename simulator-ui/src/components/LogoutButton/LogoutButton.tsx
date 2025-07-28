import styles from "./LoginButton.module.scss";
import {Api} from "../../api/api.ts";
import {Button} from "../Button/Button.tsx";
import {api} from "../../api/apiWrapper.ts";

export function LogoutButton() {

    const logout =async  () => {
        await api.auth.logoutCookieAuthLogoutCookieGet({}).then()
    }

    return (
       <Button text={"Выйти"} onClick={logout} variant={"secondary"}/>
    );
}