import clsx from "clsx";
import React from "react";
import { v4 as uuid } from "uuid";
import styles from "./textInput.module.css";

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
};

export default function TextInput({ disabled, error, id, label, ...props }: TextInputProps) {
    if (label && !id) {
        id = uuid();
    }
    return (
        <div>
            {label && (
                <label htmlFor={id} className={styles.labelText}>
                    {label}
                </label>
            )}
            <input
                {...props}
                className={clsx(styles.textInputField, "u-concave", {
                    [styles.disabled!]: disabled,
                    [styles.error!]: error,
                })}
                id={id}
                type="text"
                disabled={disabled}
            />
            {error && <div className={styles.errorText}>{error}</div>}
        </div>
    );
}
