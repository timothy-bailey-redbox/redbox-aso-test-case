import React from "react";
import styles from "./card.module.css";
import clsx from "clsx";

type CardProps = {
    children: React.ReactNode;
    borderRadius?: string;
    className?: string;
    concave?: boolean;
};

export default function Card({ children, borderRadius, className, concave }: CardProps) {
    return (
        <div
            className={clsx(styles.card, { ["convex-outlined"]: !concave, ["concave"]: concave }, className)}
            style={{ borderRadius }}
        >
            {children}
        </div>
    );
}
