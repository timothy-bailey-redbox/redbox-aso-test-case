import styles from "./index.module.css";

export default function Home() {
    return (
        <div className={styles.wrapper}>
            <div>
                <h1 className="u-title">ASO Dashboard</h1>
                <small className="u-subtitle">by Redbox Mobile</small>
            </div>
        </div>
    );
}
