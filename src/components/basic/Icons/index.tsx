import type React from "react";
import ClickIcon from "./Click";
import DownloadIcon from "./Download";
import Redbox from "./Redbox";
import Settings from "./Settings";

type SvgEl = React.FC<React.SVGProps<SVGSVGElement>>;

function iconWrap(icon: SvgEl) {
    icon.defaultProps = {
        width: 16,
        height: 16,
        fill: "currentcolor",
    };
    return icon;
}

const Icons = {
    Download: iconWrap(DownloadIcon),
    Click: iconWrap(ClickIcon),
    Redbox: iconWrap(Redbox),
    Settings: iconWrap(Settings),
} as const;

export default Icons;

export type IconName = keyof typeof Icons;

export function isIcon(iconName?: string): iconName is IconName {
    return !!iconName && iconName in Icons;
}
