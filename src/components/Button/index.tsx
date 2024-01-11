import styles from "./button.module.css";

type ButtonProps = {
    inverted?: boolean;
    onClick?: () => void;
    text?: string;
    icon?: string;
};

export default function Button({ inverted, onClick, text, icon }: ButtonProps) {
    return (
        <button className={!inverted ? styles.button : styles.buttonInverted} onClick={onClick}>
            {icon ?? text}
        </button>
    );
}
