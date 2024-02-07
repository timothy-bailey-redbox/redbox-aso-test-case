import { build } from "esbuild";
import fs from "fs/promises";
import pkg from "../package.json";

async function recursiveFileSelect(path: string, predicate?: (file: string) => boolean): Promise<string[]> {
    if (!path.endsWith("/")) path += "/";

    const files: string[] = [];

    const nodes = await fs.readdir(path);
    for (const node of nodes) {
        const stats = await fs.stat(path + node);
        if (stats.isFile()) {
            if (typeof predicate === "function") {
                if (predicate(node)) {
                    files.push(path + node);
                }
            } else {
                files.push(path + node);
            }
        }
        if (stats.isDirectory()) {
            const subFiles = await recursiveFileSelect(path + node, predicate);
            files.push(...subFiles);
        }
    }

    return files;
}

const inputDir = "./netlify/functions/";
const outputDir = "./netlify/functions/";
const nodeVersion = pkg.engines?.node?.replaceAll(/[^\d\.]/g, "") ?? "20";

const functions = await recursiveFileSelect(inputDir, (fileName) => fileName.endsWith(".ts"));

await build({
    entryPoints: functions,
    platform: "node",
    target: `node${nodeVersion}`,
    outdir: outputDir,
    bundle: true,
    format: "cjs",
    outExtension: {
        ".js": ".cjs",
    },
});
