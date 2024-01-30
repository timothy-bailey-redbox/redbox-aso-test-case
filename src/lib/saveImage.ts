import { toPng } from "html-to-image";
import { writeFileName } from "./file";
import { cssVar } from "./style";
import { delay } from "./time";

interface SaveDOMNodeConfigBase {
    background?: string;
    padding?: string;
    useText?: boolean;
    fixedSize?: boolean;
    formatter?: (el: HTMLElement) => void;
}
interface SaveDOMNodeConfigSelector extends SaveDOMNodeConfigBase {
    selector: string;
    element?: never;
}
interface SaveDOMNodeConfigElement extends SaveDOMNodeConfigBase {
    selector?: never;
    element: HTMLElement;
}

export type SaveDOMNodeConfig = SaveDOMNodeConfigSelector | SaveDOMNodeConfigElement;

export async function saveDOMNodeImage(fileName: string, elements: SaveDOMNodeConfig[]) {
    const root = document.createElement("div");
    root.style.position = "absolute";
    root.style.right = "150%";
    root.style.top = "0";

    const wrapper = document.createElement("div");
    wrapper.style.background = cssVar("--bg-color");
    wrapper.style.color = cssVar("--normal-text-color");

    elements.forEach((config) => {
        const element = config.element ?? document.querySelector(config.selector);
        if (!element) {
            console.warn("saveDOMNodeImage failed to find element matching selector: ", config.selector);
            return;
        }

        const elementSize = element.getBoundingClientRect();

        const elementWrapper = document.createElement("div");
        elementWrapper.style.background = config.background ?? cssVar("--bg-color");
        elementWrapper.style.padding = config.padding ?? "8px";
        elementWrapper.style.minWidth = "100%";
        elementWrapper.style.boxSizing = "border-box";

        if (config.fixedSize) {
            elementWrapper.style.minWidth = `${elementSize.width}px`;
            elementWrapper.style.minHeight = `${elementSize.height}px`;
            elementWrapper.style.boxSizing = "content-box";
        }

        if (config.useText && element instanceof HTMLElement) {
            const elementText = element.innerText.trim();
            const textSpan = document.createElement("span");
            textSpan.innerText = elementText;
            elementWrapper.appendChild(textSpan);
        } else {
            const clonedElement = element.cloneNode(true) as HTMLElement;
            elementWrapper.appendChild(clonedElement);
        }

        if (config.formatter) {
            config.formatter(elementWrapper);
        }

        wrapper.append(elementWrapper);
    });

    root.append(wrapper);
    document.body.appendChild(root);

    // Wait for the render to complete
    await delay(150);

    const pngData = await elementToImageData(wrapper);

    const link = document.createElement("a");
    link.href = pngData;
    link.setAttribute("download", writeFileName(fileName, "png"));

    link.click();

    // Wait for the download to complete
    await delay(150);

    document.body.removeChild(root);
}

export async function elementToImage(el: HTMLElement, backgroundColor?: string): Promise<HTMLImageElement> {
    const imageData = await elementToImageData(el, backgroundColor);
    return await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imageData;
    });
}

export async function elementToImageData(el: HTMLElement, backgroundColor?: string): Promise<string> {
    el.querySelectorAll("text").forEach((tag) => {
        tag.style.fontFamily = cssVar("--fontFamily-system");
    });

    replaceSvgWithImg(el);
    await loadExternalImages(el);

    // Wait for the images to load
    await delay(100);

    const pngData = await toPng(el, {
        backgroundColor: backgroundColor ?? cssVar("--bg-color"),
    });

    return pngData;
}

function replaceSvgWithImg(element: HTMLElement) {
    [...element.querySelectorAll("svg")].forEach((svg) => {
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        [...svg.querySelectorAll('[fill="currentColor"]')].forEach((el) => {
            el.setAttribute("fill", cssVar("color", svg));
        });
        [...svg.querySelectorAll('[fill^="var("]')].forEach((el) => {
            const varName = el.getAttribute("fill")?.replace(/^var\((.*)\)$/, "$1") ?? "";
            el.setAttribute("fill", cssVar(varName, svg));
        });
        [...svg.querySelectorAll('[stroke="currentColor"]')].forEach((el) => {
            el.setAttribute("stroke", cssVar("color", svg));
        });
        [...svg.querySelectorAll('[stroke^="var("]')].forEach((el) => {
            const varName = el.getAttribute("stroke")?.replace(/^var\((.*)\)$/, "$1") ?? "";
            el.setAttribute("stroke", cssVar(varName, svg));
        });
        const svgSize = svg.getBoundingClientRect();
        const html = svg.outerHTML;
        const img = document.createElement("img");
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(html);
        img.width = svgSize.width;
        img.height = svgSize.height;
        svg.classList.forEach((c) => img.classList.add(c));
        svg.replaceWith(img);
    });
}

async function loadExternalImages(element: HTMLElement) {
    const images = element.querySelectorAll("img");
    await Promise.all(
        [...images].map(async (img) => {
            const url = img.getAttribute("src");
            if (url && (url.startsWith("http") || url.startsWith("//"))) {
                const response = await fetch(url);
                const blob = await response.blob();
                const dataUrl: string = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
                img.setAttribute("src", dataUrl);
            }
        }),
    );
}
