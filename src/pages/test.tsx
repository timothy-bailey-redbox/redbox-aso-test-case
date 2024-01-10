import Button from "~/Components/Button/Button";
import Card from "~/Components/Card/Card";
import Switch from "~/Components/Switch/Switch";
import styles from "./test.module.css";

export default function TestPage() {
  return (
    <div className={styles.test}>
      <Card height="1000px" width="1500px">
        <Button text="Button" />
        <Button text="Button" inverted />
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
