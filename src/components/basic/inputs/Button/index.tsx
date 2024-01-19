import React from "react";
import clsx from "clsx";
import styles from "./button.module.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className, ...props }: ButtonProps) {
    return (
        <button className={clsx(className, styles.button)} {...props}>
            {children}
        </button>
    );
}
