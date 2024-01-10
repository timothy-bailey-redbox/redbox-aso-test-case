import React from "react";
import styles from "./card.module.css";

type CardProps = {
  children: React.ReactNode;
  borderRadius?: string;
};

export default function Card({ children, borderRadius }: CardProps) {
  return (
    <div className={styles.card} style={{ borderRadius }}>
      {children}
    </div>
  );
}
