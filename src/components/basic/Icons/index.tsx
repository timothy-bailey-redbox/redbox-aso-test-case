import type React from "react";
import DownloadIcon from "./Download";
import ClickIcon from "./Click";
import Redbox from "./Redbox";

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
};

export default Icons;
