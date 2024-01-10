import React, { useState } from "react";
import styles from "./switch.module.css";
import clsx from "clsx";

interface SwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

export default function Switch({ isOn, onToggle }: SwitchProps) {
  const [active, setActive] = useState(isOn);
  const styleOn = styles.on ?? "";

  return (
    <div
      className={styles.switch}
      onClick={() => {
        setActive(!active);
        onToggle();
      }}
    >
      <div className={clsx(styles.handle, { [styleOn]: active })}></div>
    </div>
  );
}
