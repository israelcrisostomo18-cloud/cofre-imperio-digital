import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await mkdir("dist/assets", { recursive: true });
await mkdir("dist/assets/optimized", { recursive: true });
await mkdir("dist/images", { recursive: true });

const html = await readFile("index.html", "utf8");
const css = await readFile("styles.css", "utf8");
const js = await readFile("script.js", "utf8");
const socialProofJs = await readFile("social-proof.js", "utf8");

await writeFile(
  "dist/index.html",
  html
    .replace(/<!--(?! Meta Pixel| End Meta Pixel)[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\n\s*\n/g, "\n")
    .trim()
);
await writeFile(
  "dist/styles.css",
  css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s*([{}:;,>])\s*/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim()
);
await writeFile("dist/script.js", js.trim());
await writeFile("dist/social-proof.js", socialProofJs.trim());

await cp("assets/optimized", "dist/assets/optimized", { recursive: true });
await cp("images", "dist/images", { recursive: true });
for (const asset of [
  "favicon.ico",
  "favicon-16.png",
  "favicon-32.png",
  "favicon-48.png",
  "apple-touch-icon.png",
  "android-chrome-192x192.png"
]) {
  await cp(`assets/${asset}`, `dist/assets/${asset}`);
}

console.log("Build completed: dist/");
