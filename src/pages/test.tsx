import Button from "~/components/Button";
import Card from "~/components/Card";
import Switch from "~/components/Switch";
import styles from "./test.module.css";
import TextInput from "~/components/TextInput";
import Grid from "~/components/Grid";

export default function TestPage() {
    return (
        <div className={styles.test}>
            <Card className={styles.dashboard}>
                <Grid>
                    {[
                        { width: 6, height: 4, element: <Card borderRadius="35px">6x4</Card> },
                        {
                            width: 6,
                            height: 6,
                            element: <Card borderRadius="35px">6x6</Card>,
                        },
                        {
                            width: 4,
                            height: 4,
                            element: (
                                <Card borderRadius="35px">
                                    <p>4x4</p>
                                    <Button>Button</Button>
                                    <Switch
                                        isOn={false}
                                        onToggle={() => {
                                            console.log("");
                                        }}
                                    />
                                    <TextInput placeHolder="Input..." />
                                    <TextInput placeHolder="Input..." disabled />
                                    <TextInput placeHolder="Input..." error="Something is wrong" value="Wrong input" />
                                </Card>
                            ),
                        },
                        { width: 2, height: 2, element: <Card borderRadius="35px">2x2</Card> },
                        { width: 8, height: 4, element: <Card borderRadius="35px">8x4</Card> },
                        { width: 4, height: 2, element: <Card borderRadius="35px">4x2</Card> },
                    ]}
                </Grid>
            </Card>
        </div>
    );
}
