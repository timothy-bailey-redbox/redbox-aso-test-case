import clsx from "clsx";
import { useState } from "react";
import styles from "./switch.module.css";

interface SwitchProps {
    isOn: boolean;
    onToggle: () => void;
}

export default function Switch({ isOn, onToggle }: SwitchProps) {
    const [active, setActive] = useState(isOn);

    return (
        <div
            className={clsx(styles.switch, "convex-outlined")}
            onClick={() => {
                setActive(!active);
                onToggle();
            }}
        >
            <div className={clsx(styles.handle, "convex-light", { [styles.on!]: active })}></div>
        </div>
    );
}
