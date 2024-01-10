import React from "react";
import styles from "./card.module.css";

type CardProps = {
  children: React.ReactNode;
  height?: string;
  width?: string;
  borderRadius?: string;
};

const Card: React.FC<CardProps> = ({
  children,
  height,
  width,
  borderRadius,
}) => {
  return (
    <div className={styles.card} style={{ height, width, borderRadius }}>
      {children}
    </div>
  );
};

export default Card;
