import InsecurePage from "~/components/auth/InsecurePage";
import LoginButton from "~/components/auth/LoginButton";
import Background from "~/components/wrappers/Background";
import styles from "./index.module.css";

export default function Home() {
    return (
        <InsecurePage>
            <Background>
                <div className={styles.wrapper}>
                    <div>
                        <h1 className="u-title">ASO Dashboard</h1>
                        <small className="u-subtitle">by Redbox Mobile</small>
                    </div>
                    <LoginButton />
                </div>
            </Background>
        </InsecurePage>
    );
}
