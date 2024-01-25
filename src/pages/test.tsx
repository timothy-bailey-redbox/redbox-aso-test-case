import DialWidget from "~/components/assemblies/Widgets/DialWidget";
import GraphWidget from "~/components/assemblies/Widgets/GraphWidget";
import PercentageBarWidget from "~/components/assemblies/Widgets/PercentageBarWidget";
import PieChartWidget from "~/components/assemblies/Widgets/PiechartWidget";
import StatWidget from "~/components/assemblies/Widgets/StatWidget";
import Card from "~/components/basic/Card";
import Grid from "~/components/basic/Grid";
import Button from "~/components/basic/inputs/Button";
import Switch from "~/components/basic/inputs/Switch";
import TextInput from "~/components/basic/inputs/TextInput";
import PageWithNav from "~/components/wrappers/PageWithNav";
import { mockBarData, mockDialsData, mockGraphData, mockPiechartData } from "~/util/mockData";
import styles from "./test.module.css";

export default function TestPage() {
    return (
        <PageWithNav>
            <h1 className={styles.dashboardTitle}>Dashboard bet 322</h1>
            <Grid>
                {[
                    {
                        width: 7,
                        height: 4,
                        x: 1,
                        y: 1,
                        element: <DialWidget title={"Dials"} data={mockDialsData} />,
                    },
                    {
                        width: 5,
                        height: 6,
                        element: <GraphWidget title="Line graph" data={mockGraphData} dataKeys={["value", "val"]} />,
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
                                <TextInput placeholder="Input..." label="Input field" />
                                <TextInput placeholder="Input..." disabled />
                                <TextInput
                                    placeholder="Input..."
                                    error="Something is wrong"
                                    value="Wrong input"
                                    readOnly
                                />
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
                                stat={"341.2"}
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
                                stat={"143.2"}
                                description={"random stat % explanation"}
                                icon="Download"
                            />
                        ),
                    },
                    {
                        width: 8,
                        height: 8,
                        element: <PercentageBarWidget data={mockBarData} title={"Bar graph"} />,
                    },
                    {
                        width: 4,
                        height: 6,
                        element: (
                            <DialWidget
                                title={"Dial"}
                                data={[mockDialsData[0] ?? { label: "", value: 0, min: 0, max: 0 }]}
                            />
                        ),
                    },
                    {
                        width: 4,
                        height: 4,
                        element: <PieChartWidget data={mockPiechartData} title={"Pie chart"} />,
                    },
                    { width: 8, height: 4, element: <Card> </Card> },
                    { width: 6, height: 4, element: <Card> </Card> },
                    { width: 6, height: 4, element: <Card> </Card> },
                ]}
            </Grid>
        </PageWithNav>
    );
}
