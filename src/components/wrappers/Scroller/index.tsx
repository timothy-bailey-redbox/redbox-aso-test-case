import React from "react";
import styles from "./scroller.module.css";

type ScrollerProps = {
    children: React.ReactNode;
};

const Scroller = ({ children }: ScrollerProps) => {
    return <div className={styles.scroller}>{children}</div>;
};

export default Scroller;
