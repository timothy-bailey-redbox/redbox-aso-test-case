import type React from "react";
import Add from "./Add";
import ClickIcon from "./Click";
import Close from "./Close";
import Delete from "./Delete";
import DownloadIcon from "./Download";
import Edit from "./Edit";
import Redbox from "./Redbox";
import Screenshot from "./Screenshot";
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
    Screenshot: iconWrap(Screenshot),
    Delete: iconWrap(Delete),
    Add: iconWrap(Add),
    Close: iconWrap(Close),
    Edit: iconWrap(Edit),
} as const;

export default Icons;

export type IconName = keyof typeof Icons;

export function isIcon(iconName?: string): iconName is IconName {
    return !!iconName && iconName in Icons;
}
