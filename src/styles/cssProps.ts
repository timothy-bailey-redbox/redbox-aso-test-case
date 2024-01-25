/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import "react";

/**
 * This is a modification to the react global to allow for setting CSS
 * custom properties inside of JSX style props.
 */
declare module "react" {
    interface CSSProperties {
        [key: `--${string}`]: string | number;
    }
}
