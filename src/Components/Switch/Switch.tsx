import React, { useState } from "react";
import styles from "./switch.module.css";

interface SwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

const Switch: React.FC<SwitchProps> = ({ isOn, onToggle }) => {
  const [active, setActive] = useState(isOn);

  return (
    <div
      className={styles.switch}
      onClick={() => {
        setActive(!active);
        onToggle();
      }}
    >
      <div className={`${styles.handle} ${active ? styles.on : ""}`}></div>
    </div>
  );
};

export default Switch;
