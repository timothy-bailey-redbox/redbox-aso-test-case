import React from "react";
import clsx from "clsx";
import styles from "./button.module.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, ...props }: ButtonProps) {
    return (
        <div>
            <button className={clsx(props.className, styles.button)} {...props}>
                {children}
            </button>
        </div>
    );
}
