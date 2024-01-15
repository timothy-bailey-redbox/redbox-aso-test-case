import React from "react";
import styles from "./grid.module.css";

type GridProps = {
    children: GridItemProps[];
};

type GridItemProps = {
    width: number;
    height: number;
    element: React.ReactNode;
};

const Grid: React.FC<GridProps> = ({ children }) => {
    return (
        <div className={styles.gridContainer}>
            {children.map((child, index) => (
                <div
                    key={index}
                    className={styles.gridItem}
                    style={{ gridColumnEnd: `span ${child.width}`, gridRowEnd: `span ${child.height}` }}
                >
                    {child.element}
                </div>
            ))}
        </div>
    );
};

export default Grid;
