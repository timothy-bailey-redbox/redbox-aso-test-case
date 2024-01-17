import React from "react";
import styles from "./card.module.css";
import clsx from "clsx";

type CardProps = {
    children: React.ReactNode;
    className?: string;
    concave?: boolean;
    title?: string;
};

export default function Card({ children, className, concave, title }: CardProps) {
    return (
        <div className={clsx(styles.card, { ["u-convex-outlined"]: !concave, ["u-concave"]: concave }, className)}>
            {title && <div className={styles.titleText}>{title}</div>}
            {children}
        </div>
    );
}
