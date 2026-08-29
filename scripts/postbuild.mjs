import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

for (const route of ["privacy", "terms", "demo", "404"]) {
  await mkdir(`dist/${route}`, { recursive: true });
  await cp("dist/index.html", `dist/${route}/index.html`);
}
await cp("dist/index.html", "dist/404.html");
await cp("staticwebapp.config.json", "dist/staticwebapp.config.json");

const buildId =
  process.env.VITE_BUILD_ID ||
  execFileSync("git", ["rev-parse", "--short=12", "HEAD"], {
    encoding: "utf8",
  }).trim();
for (const asset of (await readdir("dist/assets")).filter((name) =>
  name.endsWith(".js"),
)) {
  const path = `dist/assets/${asset}`;
  await writeFile(
    path,
    (await readFile(path, "utf8")).replaceAll("__BUILD_ID__", buildId),
  );
}
const offlinePath = "dist/offline.html";
await writeFile(
  offlinePath,
  (await readFile(offlinePath, "utf8")).replaceAll("__BUILD_ID__", buildId),
);

const generatedAssets = (await readdir("dist/assets"))
  .filter((name) => !name.endsWith(".map"))
  .map((name) => `/assets/${name}`);
const swPath = "dist/sw.js";
const sw = await readFile(swPath, "utf8");
const core = [
  "/",
  "/index.html",
  "/demo",
  "/404",
  "/404.html",
  "/offline.html",
  "/offline.css",
  "/print.css",
  "/manifest.webmanifest",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-512-maskable.png",
  ...generatedAssets,
];
await writeFile(
  swPath,
  sw.replace(/const CORE = \[[^;]+;/, `const CORE = ${JSON.stringify(core)};`),
);
