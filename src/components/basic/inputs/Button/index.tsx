import clsx from "clsx";
import React from "react";
import styles from "./button.module.css";

type ButtonProps = {
    pending?: boolean;
    danger?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className, pending, danger, disabled, ...props }: ButtonProps) {
    return (
        <button
            className={clsx(className, styles.button, { [styles.pending!]: pending, [styles.danger!]: danger })}
            disabled={!!disabled || !!pending}
            type="button"
            {...props}
        >
            {children}
        </button>
    );
}
