import React from "react";
import styles from "./percentagebarwidget.module.css";
import Card from "~/components/basic/Card";

type PercentageBarData = {
    label: string;
    percentage: number;
};

type PercentageBarWidgetProps = {
    data: PercentageBarData[];
    title: string;
};

export default function PercentageBarWidget({ data, title }: PercentageBarWidgetProps) {
    return (
        <Card title={title}>
            <div className={styles.percentageBarContainer}>
                {data.map((item, index) => (
                    <div className={styles.percentageBarItem} key={index}>
                        <div className={styles.percentageBarFull}>
                            <div className={styles.percentageBarFilled} style={{ height: `${item.percentage}%` }}></div>
                        </div>
                        <div className={styles.percentageBarLabel}>{item.label}</div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
