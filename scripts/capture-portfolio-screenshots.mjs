/**
 * Captures desktop + mobile portfolio screenshots after dismissing cookie banners.
 * Usage: node scripts/capture-portfolio-screenshots.mjs [url] [name-prefix]
 */
import { chromium } from "playwright";
import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const COOKIE_ACCEPT_PATTERNS = [
  /accept all/i,
  /accept cookies/i,
  /allow all/i,
  /agree/i,
  /got it/i,
  /aceitar todos/i,
  /aceitar/i,
  /concordo/i,
  /permitir todos/i,
  /permitir/i,
];

async function acceptCookies(page) {
  for (const pattern of COOKIE_ACCEPT_PATTERNS) {
    const btn = page.getByRole("button", { name: pattern });
    if (await btn.count()) {
      await btn.first().click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1000);
      return true;
    }
  }
  return false;
}

function pngToWebp(pngPath, webpPath, width, height) {
  const py = `
from PIL import Image
im = Image.open(${JSON.stringify(pngPath)}).convert("RGB")
w, h = ${width}, ${height === null ? "None" : height}
if h is None:
    w = ${width}
    h = int(im.height * (w / im.width))
    im = im.resize((w, h), Image.Resampling.LANCZOS)
else:
    im = im.resize((w, h), Image.Resampling.LANCZOS)
im.save(${JSON.stringify(webpPath)}, "WEBP", quality=85, method=6)
`;
  const r = spawnSync("python3", ["-c", py], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(r.stderr || "webp conversion failed");
}

async function capture(url, namePrefix) {
  const outDir = path.join(root, "public/portfolio");
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  try {
    const specs = [
      { suffix: "desktop", width: 1200, height: 750, outW: 1200, outH: 750 },
      { suffix: "mobile", width: 390, height: 844, outW: 400, outH: null },
    ];

    for (const { suffix, width, height, outW, outH } of specs) {
      const page = await browser.newPage({ viewport: { width, height } });
      await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 });
      await page.waitForTimeout(1500);
      const accepted = await acceptCookies(page);
      console.log(`${suffix}: cookies ${accepted ? "accepted" : "no banner found"}`);
      await page.waitForTimeout(600);

      const pngPath = path.join(outDir, `${namePrefix}-${suffix}.png`);
      const webpPath = path.join(outDir, `${namePrefix}-${suffix}.webp`);
      await page.screenshot({ path: pngPath, type: "png", fullPage: false });
      await page.close();

      pngToWebp(pngPath, webpPath, outW, outH);
      await unlink(pngPath).catch(() => {});
      console.log("Wrote", webpPath);
    }
  } finally {
    await browser.close();
  }
}

const url = process.argv[2] ?? "https://www.sensorahome.com.br/";
const name = process.argv[3] ?? "sensora-home";
await capture(url, name);
