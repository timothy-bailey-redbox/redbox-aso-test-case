import useUserStore from "~/stores/user";
import Button from "../basic/inputs/Button";

export default function LogoutButton() {
    const user = useUserStore();
    return <Button onClick={user.logout}>Logout</Button>;
}
