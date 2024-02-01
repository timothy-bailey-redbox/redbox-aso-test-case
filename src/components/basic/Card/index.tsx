import clsx from "clsx";
import React from "react";
import styles from "./card.module.css";

type CardProps = React.PropsWithChildren<{
    className?: string;
    concave?: boolean;
    title?: React.ReactNode;
    actionButton?: React.ReactNode;
}>;

export default function Card({ children, className, concave, title, actionButton }: CardProps) {
    const hasHeader = !!title || !!actionButton;

    return (
        <div className={clsx(styles.card, { ["u-convex-outlined"]: !concave, ["u-concave"]: concave }, className)}>
            {hasHeader && (
                <header className={styles.header}>
                    {!!title && <h2 className={styles.titleText}>{title}</h2>}
                    {!!actionButton && <div className={styles.button}>{actionButton}</div>}
                </header>
            )}
            {children}
        </div>
    );
}
