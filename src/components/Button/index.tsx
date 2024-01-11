import clsx from "clsx";
import styles from "./button.module.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    inverted?: boolean;
};

export default function Button({ inverted, children, className, ...props }: ButtonProps) {
    return (
        <button className={clsx(className, !inverted ? styles.button : styles.buttonInverted)} {...props}>
            {children}
        </button>
    );
}
