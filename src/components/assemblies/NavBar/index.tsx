import Icons from "~/components/basic/Icons";
import TextInput from "../../basic/inputs/TextInput";
import styles from "./navbar.module.css";

export default function NavBar() {
    return (
        <div className={styles.navbar}>
            <div className={styles.wrapper}>
                <Icons.Redbox height={100} width={132} />
                <TextInput placeHolder="Search..."></TextInput>
            </div>
        </div>
    );
}
