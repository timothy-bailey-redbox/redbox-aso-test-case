import clsx from "clsx";
import React from "react";
import { v4 as uuid } from "uuid";
import styles from "./textInput.module.css";

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    inputClassName?: string;
};

export default function Input({ disabled, error, id, label, className, inputClassName, ...props }: TextInputProps) {
    if (label && !id) {
        id = uuid();
    }
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className={styles.labelText}>
                    {label}
                </label>
            )}
            <input
                type="text"
                {...props}
                className={clsx(inputClassName, styles.textInputField, "u-concave", {
                    [styles.disabled!]: disabled,
                    [styles.error!]: error,
                })}
                id={id}
                disabled={disabled}
            />
            {error && <div className={styles.errorText}>{error}</div>}
        </div>
    );
}
