import InsecurePage from "~/components/auth/InsecurePage";
import LoginButton from "~/components/auth/LoginButton";
import styles from "./index.module.css";

export default function Home() {
    return (
        <InsecurePage>
            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>ASO Dashboards</h1>
                    <div className={styles.cardRow}>
                        <LoginButton />
                    </div>
                </div>
            </main>
        </InsecurePage>
    );
}
