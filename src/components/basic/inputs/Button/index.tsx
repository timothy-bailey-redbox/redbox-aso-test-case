import React from "react";
import clsx from "clsx";
import styles from "./button.module.css";

type ButtonProps = {
    pending?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className, pending, disabled, ...props }: ButtonProps) {
    return (
        <button
            className={clsx(className, styles.button, { [styles.pending!]: pending })}
            disabled={!!disabled || !!pending}
            {...props}
        >
            {children}
        </button>
    );
}
