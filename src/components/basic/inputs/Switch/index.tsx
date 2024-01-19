import clsx from "clsx";
import { useState, useEffect } from "react";
import styles from "./switch.module.css";

interface SwitchProps {
    isOn: boolean;
    onToggle: () => void;
    label?: string;
}

export default function Switch({ isOn, onToggle, label }: SwitchProps) {
    const [active, setActive] = useState(isOn);

    useEffect(() => {
        setActive(isOn);
    }, [isOn]);

    const handleToggle = () => {
        setActive(!active);
        onToggle();
    };

    return (
        <div>
            <label>
                {label && <span className={styles.labelText}>{label}</span>}
                <input
                    type="checkbox"
                    checked={active}
                    onChange={handleToggle}
                    className={styles.switchCheckbox}
                    aria-label={label}
                />
                <div className={clsx(styles.switch, "u-convex-outlined")}>
                    <div
                        className={clsx(styles.handle, "u-convex-light", {
                            [styles.on!]: active,
                        })}
                    ></div>
                </div>
            </label>
        </div>
    );
}
