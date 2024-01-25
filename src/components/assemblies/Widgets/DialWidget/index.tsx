import Card from "~/components/basic/Card";
import styles from "./dialwidget.module.css";
import { calculatePercentage } from "~/util/functions";

type DialData = {
    label: string;
    value: number;
    min: number;
    max: number;
};

type DialWidgetProps = {
    data: DialData[];
    title: string;
};

export default function DialWidget({ data, title }: DialWidgetProps) {
    return (
        <Card title={title}>
            <div className={styles.dialContainer}>
                {data.map((dial, index) => {
                    const percentage = calculatePercentage(dial.value, dial.min, dial.max);
                    return (
                        <div key={index} className={styles.dial}>
                            <div className={styles.dialPercentageWrapper}>
                                <div className={styles.dialPercentage} style={{ "--percentage": `${percentage}%` }} />
                                <div className={styles.dialText}>{percentage}%</div>
                            </div>
                            <div className={styles.dialLabel}>{dial.label}</div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
