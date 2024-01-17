import Button from "~/components/basic/inputs/Button";
import Card from "~/components/basic/Card";
import Switch from "~/components/basic/inputs/Switch";
import TextInput from "~/components/basic/inputs/TextInput";
import Grid from "~/components/basic/Grid";
import Background from "~/components/wrappers/Background";
import StatWidget from "~/components/assemblies/Widgets/StatWidget";
import GraphWidget from "~/components/assemblies/Widgets/LineGraphWidget";
import Scroller from "~/components/wrappers/Scroller";
import NavBar from "~/components/assemblies/NavBar";
import styles from "./test.module.css";
import { mockGraphData } from "~/util/mockData";

export default function TestPage() {
    return (
        <Background fullSize>
            <NavBar />
            <Scroller>
                <p className={styles.dashboardTitle}>Dashboard bet 322</p>
                <Grid>
                    {[
                        { width: 7, height: 4, x: 1, y: 1, element: <Card> </Card> },
                        {
                            width: 5,
                            height: 6,
                            element: <GraphWidget title="Line graph" data={mockGraphData} />,
                        },
                        {
                            width: 4,
                            height: 4,
                            element: (
                                <Card title="Widget">
                                    <Switch
                                        isOn={false}
                                        label="Switch"
                                        onToggle={() => {
                                            console.log("");
                                        }}
                                    />
                                    <TextInput placeHolder="Input..." label="Input field" />
                                    <TextInput placeHolder="Input..." disabled />
                                    <TextInput placeHolder="Input..." error="Something is wrong" value="Wrong input" />
                                    <Button>Button</Button>
                                </Card>
                            ),
                        },
                        {
                            width: 3,
                            height: 1,
                            element: (
                                <StatWidget
                                    title={"Click stat"}
                                    stat={"341,2"}
                                    description={"random stat % explanation"}
                                    icon="Click"
                                />
                            ),
                        },
                        {
                            width: 3,
                            height: 1,
                            element: (
                                <StatWidget
                                    title={"Download stat"}
                                    stat={"143,2"}
                                    description={"random stat % explanation"}
                                    icon="Download"
                                />
                            ),
                        },
                        { width: 8, height: 8, element: <Card> </Card> },
                        { width: 4, height: 6, element: <Card> </Card> },
                        { width: 4, height: 4, element: <Card> </Card> },
                        { width: 4, height: 4, element: <Card> </Card> },
                        { width: 4, height: 4, element: <Card> </Card> },
                        { width: 6, height: 4, element: <Card> </Card> },
                        { width: 6, height: 4, element: <Card> </Card> },
                    ]}
                </Grid>
            </Scroller>
        </Background>
    );
}
