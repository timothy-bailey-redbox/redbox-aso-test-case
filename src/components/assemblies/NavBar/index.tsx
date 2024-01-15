import TextInput from "../../TextInput";
import styles from "./navbar.module.css";

type NavBarProps = {
    mode: "view" | "create";
};

export default function LoadingScreen({}: NavBarProps) {
    return (
        <div className={styles.navbar}>
            <TextInput placeHolder="Search..."></TextInput>
        </div>
    );
}
