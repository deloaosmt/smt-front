import {DefaultService} from "../api";
import {onError} from "../common/OnError";

export const doRegister = (event: React.FormEvent<HTMLFormElement>, onSuccess: VoidFunction, onErrorCallback: VoidFunction) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    DefaultService.userRegister({
        login: data.get("login") as string,
        password: data.get("password") as string,
        tg_login: data.get("tg_login") as string,
        city: data.get("city") as string,
        first_name: data.get("first_name") as string,
        last_name: data.get("last_name") as string,
        email: data.get("email") as string
    }).then(
        () => onSuccess(),
        (error) => {
            onError(error);
            onErrorCallback();
        }
    );
}; 