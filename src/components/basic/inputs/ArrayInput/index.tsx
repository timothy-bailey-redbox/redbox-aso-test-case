import clsx from "clsx";
import { forwardRef, useCallback, useState } from "react";
import { v4 as uuid } from "uuid";
import { uniqBy } from "~/lib/array";
import { isNotNil } from "~/lib/type";
import Icons from "../../Icons";
import Button from "../Button";
import inputStyles from "../Input/textInput.module.css";
import styles from "./array.module.css";

type ArrayInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "defaultValue"> & {
    value?: string[];
    defaultValue?: string[];
    onChange?: (values: string[]) => void;

    label?: string;
    error?: string | (string | undefined)[];
    inputClassName?: string;
    caseSensitive?: boolean;
};

const ArrayInput = forwardRef<HTMLInputElement, ArrayInputProps>(function ArrayInput(
    {
        value = [],
        onChange = () => {
            /*noop*/
        },
        label,
        error,
        className,
        inputClassName,
        disabled,
        id,
        defaultValue = [],
        caseSensitive,
        ...props
    },
    _ref,
) {
    if (label && !id) {
        id = uuid();
    }
    if (value.length < 1) {
        value = defaultValue;
    }

    const [inputValue, setInputValue] = useState("");

    const onPaste = useCallback(
        (e: React.ClipboardEvent<HTMLInputElement>) => {
            e.preventDefault();
            const pastedText = e.clipboardData.getData("text/plain");
            const parsed = pastedText
                .trim()
                .split("\n")
                .map((t) => t.trim())
                .join(", ");

            const start = e.currentTarget.selectionStart ?? 0;
            const end = e.currentTarget.selectionEnd ?? 0;
            const length = end - start;

            const newValueChars = inputValue.split("");
            newValueChars.splice(start, length, ...parsed.split(""));
            const newValue = newValueChars.join("");
            setInputValue(newValue);
        },
        [inputValue, setInputValue],
    );

    const addValue = useCallback(() => {
        const newValue = inputValue;
        let newValues: string[];
        if (newValue.includes(",")) {
            newValues = newValue.split(",").map((val) => val.trim());
        } else {
            newValues = [newValue.trim()];
        }
        newValues = newValues.filter((val) => !!val.trim());

        const changedValue = uniqBy([...value, ...newValues], caseSensitive ? (a) => a : (a) => a.toLocaleLowerCase());

        onChange(changedValue);
        setInputValue("");
    }, [inputValue, setInputValue, onChange, caseSensitive, value]);

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addValue();
            }
        },
        [addValue],
    );

    const onBlur = useCallback(() => {
        if (inputValue) {
            addValue();
        }
    }, [inputValue, addValue]);

    const removeValues = useCallback(
        (removedValues: string[]) => {
            const newValues = value.filter((val) => !removedValues.includes(val));
            onChange(newValues);
        },
        [value, onChange],
    );

    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className={inputStyles.labelText}>
                    {label}
                </label>
            )}
            <div className={styles.inputWrapper}>
                <input
                    type="text"
                    {...props}
                    className={clsx(inputClassName, inputStyles.textInputField, "u-concave", {
                        [inputStyles.disabled!]: disabled,
                        [inputStyles.error!]: !Array.isArray(error) && error,
                    })}
                    id={id}
                    disabled={disabled}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onPaste={onPaste}
                    onKeyDown={onKeyDown}
                    onBlur={onBlur}
                />
                <button onClick={addValue} className={styles.add} type="button">
                    <Icons.Add />
                </button>
            </div>
            <ul className={styles.array}>
                {value.map((val, i) => (
                    <li
                        key={val}
                        className={clsx({
                            [inputStyles.error!]: error && Array.isArray(error) && error[i],
                        })}
                    >
                        <span>{val}</span>
                        <Button onClick={() => removeValues([val])}>
                            <Icons.Delete />
                        </Button>
                    </li>
                ))}
            </ul>
            {
                <div className={inputStyles.errorText}>
                    {Array.isArray(error) ? error.filter(isNotNil).join(", ") : error}
                </div>
            }
        </div>
    );
});

export default ArrayInput;
