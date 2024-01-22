import React from "react";
import styles from "./background.module.css";
import clsx from "clsx";
import Card from "../../basic/Card";

type BackgroundProps = {
    children: React.ReactNode;
    fullSize: boolean;
};

export default function Background({ children, fullSize }: BackgroundProps) {
    return (
        <div className={styles.background}>
            <div className={styles.ribbonContainer}>
                <div className={clsx(styles.ribbon, styles.vertical, styles.orange)}></div>
                <div className={clsx(styles.ribbon, styles.horizontal, styles.purple)}></div>
                <div className={clsx(styles.ribbon, styles.vertical, styles.orange)}></div>
                <div className={clsx(styles.ribbon, styles.horizontal, styles.purple)}></div>
            </div>
            <Card className={clsx({ [styles.fullSize!]: fullSize })}>{children}</Card>
        </div>
    );
}
