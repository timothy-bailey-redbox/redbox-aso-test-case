import React from "react";
import NavBar from "~/components/assemblies/NavBar";
import Background from "../Background";
import styles from "./page.module.css";

type PageWithNavProps = React.PropsWithChildren;

export default function PageWithNav({ children }: PageWithNavProps) {
    return (
        <Background fullSize className={styles.wrapper}>
            <NavBar />
            <div className={styles.page}>{children}</div>
        </Background>
    );
}
