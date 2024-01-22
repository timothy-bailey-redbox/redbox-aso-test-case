import React from "react";
import styles from "./grid.module.css";

type GridProps = {
    children: GridItemProps[];
};

type GridItemProps = {
    id?: number;
    x?: number;
    y?: number;
    width: number;
    height: number;
    element: React.ReactNode;
};

export default function Grid({ children }: GridProps) {
    return (
        <div className={styles.gridContainer}>
            {children.map((child, index) => (
                <div
                    key={child.id ?? index}
                    className={styles.gridItem}
                    style={{
                        gridColumnStart: child.x,
                        gridRowStart: child.y,
                        gridColumnEnd: `span ${child.width}`,
                        gridRowEnd: `span ${child.height}`,
                    }}
                >
                    {child.element}
                </div>
            ))}
        </div>
    );
}
