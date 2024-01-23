import React from "react";
import styles from "./dialwidget.module.css";
import Card from "~/components/basic/Card";

type DialData = {
    label: string;
    percentage: number;
};

type DialWidgetProps = {
    data: DialData[];
    title: string;
};

export default function DialWidget({ data, title }: DialWidgetProps) {
    return (
        <Card title={title}>
            <div className={styles.dialContainer}>
                {data.map((dial, index) => (
                    <div key={index} className={styles.dial}>
                        <div className={styles.dialPercentageWrapper}>
                            <div
                                className={styles.dialPercentage}
                                style={{ "--percentage": `${dial.percentage}%` } as React.CSSProperties}
                            />
                            <div className={styles.dialText}>{dial.percentage}%</div>
                        </div>
                        <div className={styles.dialLabel}>{dial.label}</div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
