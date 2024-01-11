import Button from "~/components/Button";
import Card from "~/components/Card";
import Switch from "~/components/Switch";
import styles from "./test.module.css";

export default function TestPage() {
    return (
        <div className={styles.test}>
            <Card>
                <Button>Button</Button>
                <Button inverted>Button</Button>
                <Switch
                    isOn={false}
                    onToggle={() => {
                        console.log("");
                    }}
                />
            </Card>
        </div>
    );
}
