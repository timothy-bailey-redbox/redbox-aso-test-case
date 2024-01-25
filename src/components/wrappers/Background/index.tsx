import clsx from "clsx";
import React from "react";
import styles from "./background.module.css";

type BackgroundProps = {
    children: React.ReactNode;
    fullSize: boolean;
    className?: string;
};

export default function Background({ children, className, fullSize }: BackgroundProps) {
    return (
        <div className={clsx(styles.background)}>
            <div className={styles.ribbonContainer}>
                <div className={clsx(styles.ribbon, styles.vertical, styles.orange)}></div>
                <div className={clsx(styles.ribbon, styles.horizontal, styles.purple)}></div>
                <div className={clsx(styles.ribbon, styles.vertical, styles.orange)}></div>
                <div className={clsx(styles.ribbon, styles.horizontal, styles.purple)}></div>
            </div>
            <div className={clsx(className, styles.card, { [styles.fullSize!]: fullSize })}>{children}</div>
        </div>
    );
}
