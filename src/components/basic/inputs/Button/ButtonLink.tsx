import clsx from "clsx";
import Link, { type LinkProps } from "next/link";
import React from "react";
import styles from "./button.module.css";

type ButtonLinkProps = LinkProps &
    React.PropsWithChildren<{
        className?: string;
    }>;

export default function ButtonLink({ children, className, ...props }: ButtonLinkProps) {
    return (
        <Link className={clsx(className, styles.button)} {...props}>
            {children}
        </Link>
    );
}
