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
            className={styles.switch}
            onClick={() => {
                setActive(!active);
                onToggle();
            }}
        >
            <div className={clsx(styles.handle, { [styles.on!]: active })}></div>
        </div>
    );
}
