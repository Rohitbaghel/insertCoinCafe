const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const MEDIA = "/cursor/stores/self/media";
const ARTIFACTS = "/opt/cursor/artifacts";

async function main() {
  fs.mkdirSync(MEDIA, { recursive: true });
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const videoDir = path.join(ARTIFACTS, "pw-video-rate");
  fs.rmSync(videoDir, { recursive: true, force: true });
  fs.mkdirSync(videoDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: videoDir, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  page.on("pageerror", (err) => console.error("PAGEERROR", err.message));

  await page.goto("http://127.0.0.1:43127/", { waitUntil: "networkidle" });
  await page.waitForSelector("text=Welcome to InsertCoinCafe.in");
  await page.waitForSelector("text=InsertCoinCafe");
  await page.waitForTimeout(600);

  const dashPath = path.join(MEDIA, "dashboard-sidebar-demo.png");
  await page.screenshot({ path: dashPath, fullPage: false });
  await page.screenshot({
    path: path.join(ARTIFACTS, "dashboard-sidebar-demo.png"),
    fullPage: false,
  });

  // Start Seat 1 so PS3 locks on rate card
  const seat1 = page.locator("article").filter({ hasText: "Seat 1" });
  await seat1.getByRole("button", { name: "Start" }).click();
  await page.waitForTimeout(1000);

  await page.getByRole("link", { name: "Rate Card" }).click();
  await page.waitForSelector("text=Manage game types and billing rates");
  await page.waitForTimeout(800);

  const ratePath = path.join(MEDIA, "rate-card-demo.png");
  await page.screenshot({ path: ratePath, fullPage: false });
  await page.screenshot({
    path: path.join(ARTIFACTS, "rate-card-demo.png"),
    fullPage: false,
  });

  // Scroll to see locked banner
  await page.getByText("Cannot modify when stations are in running state").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const lockedPath = path.join(MEDIA, "rate-card-locked-demo.png");
  await page.screenshot({ path: lockedPath, fullPage: false });
  await page.screenshot({
    path: path.join(ARTIFACTS, "rate-card-locked-demo.png"),
    fullPage: false,
  });

  // Change PS4 price (unlocked), save
  const ps4Card = page.locator("article").filter({ hasText: "PlayStation (PS4)" }).first();
  const priceInput = ps4Card.locator('input[type="number"]').nth(1);
  await priceInput.fill("45");
  await page.getByRole("button", { name: "Save Changes" }).click();
  await page.waitForTimeout(800);

  await page.getByRole("link", { name: "Dashboard" }).click();
  await page.waitForSelector("text=Billing");
  await page.waitForTimeout(500);

  const afterPath = path.join(MEDIA, "rate-card-wired-dashboard.png");
  await page.screenshot({ path: afterPath, fullPage: false });
  await page.screenshot({
    path: path.join(ARTIFACTS, "rate-card-wired-dashboard.png"),
    fullPage: false,
  });

  await context.close();
  await browser.close();

  const videos = fs
    .readdirSync(videoDir)
    .filter((f) => f.endsWith(".webm"))
    .map((f) => ({ f, size: fs.statSync(path.join(videoDir, f)).size }))
    .sort((a, b) => b.size - a.size);
  if (!videos.length || videos[0].size === 0) throw new Error("No video");
  const src = path.join(videoDir, videos[0].f);
  fs.copyFileSync(src, path.join(MEDIA, "rate-card-flow.webm"));
  fs.copyFileSync(src, path.join(ARTIFACTS, "rate-card-flow.webm"));
  execSync(
    `ffmpeg -y -i "${src}" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "${path.join(MEDIA, "rate-card-flow.mp4")}"`,
    { stdio: "pipe" }
  );
  fs.copyFileSync(
    path.join(MEDIA, "rate-card-flow.mp4"),
    path.join(ARTIFACTS, "rate-card-flow.mp4")
  );

  const out = {
    dashPath,
    ratePath,
    lockedPath,
    afterPath,
    mp4: path.join(MEDIA, "rate-card-flow.mp4"),
    sizes: Object.fromEntries(
      [dashPath, ratePath, lockedPath, afterPath, path.join(MEDIA, "rate-card-flow.mp4")].map(
        (p) => [path.basename(p), fs.statSync(p).size]
      )
    ),
  };
  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
