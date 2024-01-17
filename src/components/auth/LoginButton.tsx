import useUserStore from "~/stores/user";
import Button from "../basic/inputs/Button";

export default function LoginButton() {
    const user = useUserStore();
    return <Button onClick={user.openLoginModal}>Login</Button>;
}
