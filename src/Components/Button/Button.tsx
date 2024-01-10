import React from "react";
import styles from "./button.module.css";

type ButtonProps = {
  inverted?: boolean;
  onClick?: () => void;
  text?: string;
  icon?: string;
};

const Button: React.FC<ButtonProps> = ({ inverted, onClick, text, icon }) => {
  return (
    <button
      className={!inverted ? styles.button : styles.buttonInverted}
      onClick={onClick}
    >
      {icon ?? text}
    </button>
  );
};

export default Button;
