import Card from "~/components/basic/Card";
import TextInput from "../../basic/inputs/TextInput";
import styles from "./navbar.module.css";
import Icons from "~/components/basic/Icons";

export default function NavBar() {
    return (
        <Card className={styles.navbar}>
            <Icons.Redbox height={100} width={132} />
            <TextInput placeHolder="Search..."></TextInput>
        </Card>
    );
}
