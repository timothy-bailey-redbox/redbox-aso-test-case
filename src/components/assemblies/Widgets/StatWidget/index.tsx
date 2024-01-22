import React from "react";
import Card from "~/components/basic/Card";
import styles from "./statwidget.module.css";
import clsx from "clsx";
import Icons from "~/components/basic/Icons";

type StatWidgetProps = {
    title: string;
    stat: string;
    description: string;
    icon: keyof typeof Icons;
};

export default function StatWidget({ title, stat, description, icon }: StatWidgetProps) {
    const Icon = Icons[icon];
    return (
        <Card title={title}>
            <div className={styles.statWidget}>
                <div>
                    <p className={styles.stat}>{stat}</p>
                    <p className={styles.description}>{description}</p>
                </div>
                <div className={clsx(styles.iconContainer, "u-concave")}>
                    <Icon width={32} height={32} className={styles.icon} />
                </div>
            </div>
        </Card>
    );
}
