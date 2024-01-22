import React from "react";
import styles from "./textInput.module.css";
import clsx from "clsx";

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    placeHolder?: string;
    label?: string;
    disabled?: boolean;
    error?: string;
    value?: string;
};

export default function TextInput({ placeHolder, disabled, error, value, label, ...props }: TextInputProps) {
    return (
        <div>
            {label && <div className={styles.labelText}>{label}</div>}
            <input
                {...props}
                className={clsx(styles.textInputField, "u-concave", {
                    [styles.disabled!]: disabled,
                    [styles.error!]: error,
                })}
                placeholder={placeHolder}
                type="text"
                disabled={disabled}
                value={value}
            />
            {error && <div className={styles.errorText}>{error}</div>}
        </div>
    );
}
