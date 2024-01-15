import React from "react";
import styles from "./textInput.module.css";
import clsx from "clsx";

type TextInput = {
    placeHolder: string;
    disabled?: boolean;
    error?: string;
    value?: string;
};

export default function Card({ placeHolder, disabled, error, value }: TextInput) {
    return (
        <div className={styles.textInput}>
            <input
                className={clsx(styles.textInputField, "concave", {
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
