export function createFile(data: string, { fileName = "export", fileType = "text/plain", format = "txt" } = {}) {
    const url = window.URL.createObjectURL(new Blob([data], { type: fileType }));
    fileName = writeFileName(fileName, format);
    return { url, fileName };
}

export function saveFile(data: string, { fileName = "export", fileType = "text/plain", format = "txt" } = {}) {
    const file = createFile(data, {
        fileName,
        fileType,
        format,
    });

    const link = document.createElement("a");
    link.setAttribute("href", file.url);
    link.setAttribute("download", file.fileName);
    link.style.display = "none";

    link.click();

    return file;
}

export function writeFileName(title: string, format: string) {
    const safeTitle = title
        .replace(/(:|\/|\\|=|'|`|!|>|<|%|#|\$|£|€|\{|\}|\?|"|\|&|\*|@|;|,)/g, "")
        .replace(new RegExp(`\\.${format}$`, "i"), "");
    return `${safeTitle} - Redbox ASO - ${writeDate()}.${format}`;
}

function writeDate() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = `${now.getUTCMonth() + 1}`.padStart(2, "0");
    const date = `${now.getUTCDate()}`.padStart(2, "0");
    const hour = `${now.getUTCHours()}`.padStart(2, "0");
    const minute = `${now.getUTCMinutes()}`.padStart(2, "0");
    return `${year}-${month}-${date} ${hour}-${minute}`;
}
