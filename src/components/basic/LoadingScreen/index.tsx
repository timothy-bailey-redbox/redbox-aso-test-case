import styles from "./loading.module.css";

type LoadingScreenProps = {
    label?: React.ReactNode;
};

export default function LoadingScreen({ label }: LoadingScreenProps) {
    return <div className={styles.view}>{label ?? <>Loading&hellip;</>}</div>;
}
