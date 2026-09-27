const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const MEDIA = "/cursor/stores/self/media";
const ARTIFACTS = "/opt/cursor/artifacts";

async function main() {
  fs.mkdirSync(MEDIA, { recursive: true });
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const videoDir = path.join(ARTIFACTS, "pw-video");
  fs.mkdirSync(videoDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1440, height: 900 },
    },
  });
  const page = await context.newPage();
  page.on("pageerror", (err) => console.error("PAGEERROR", err.message));

  await page.goto("http://127.0.0.1:43127/", { waitUntil: "networkidle" });
  await page.waitForSelector("text=Welcome to InsertCoinCafe.in");
  await page.waitForTimeout(800);

  const idlePath = path.join(MEDIA, "dashboard-demo.png");
  await page.screenshot({ path: idlePath, fullPage: false });
  await page.screenshot({
    path: path.join(ARTIFACTS, "dashboard-demo.png"),
    fullPage: false,
  });

  const seat1 = page.locator("article").filter({ hasText: "Seat 1 - PS3" });
  await seat1.getByRole("button", { name: "Start" }).click();
  await page.waitForTimeout(2800);

  const activePath = path.join(MEDIA, "session-active.png");
  await page.screenshot({ path: activePath, fullPage: false });
  await page.screenshot({
    path: path.join(ARTIFACTS, "session-active.png"),
    fullPage: false,
  });

  await seat1.getByRole("button", { name: "Done" }).click();
  await page.waitForSelector("text=Seat 1 · PS3");
  await page.waitForTimeout(400);

  await page.getByPlaceholder("10-digit mobile number").fill("9876543210");
  await page.getByPlaceholder("Customer name").fill("Rahul");
  const discountInput = page.locator('input[type="number"]').first();
  await discountInput.fill("-10");
  await page.waitForTimeout(400);

  const billingPath = path.join(MEDIA, "billing-complete.png");
  await page.screenshot({ path: billingPath, fullPage: false });
  await page.screenshot({
    path: path.join(ARTIFACTS, "billing-complete.png"),
    fullPage: false,
  });

  const seat2 = page.locator("article").filter({ hasText: "Seat 2 - PS3" });
  await seat2.getByRole("button", { name: "Start" }).click();
  await page.waitForTimeout(1200);
  await seat2.getByRole("button", { name: "Pause" }).click();
  await page.waitForTimeout(400);
  await seat2.getByRole("button", { name: "Done" }).click();
  await page.waitForTimeout(800);

  await context.close();
  await browser.close();

  const videos = fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"));
  if (videos.length === 0) throw new Error("No video recorded");
  const srcVideo = path.join(videoDir, videos[0]);
  const webmMedia = path.join(MEDIA, "session-flow.webm");
  fs.copyFileSync(srcVideo, webmMedia);
  fs.copyFileSync(srcVideo, path.join(ARTIFACTS, "session-flow.webm"));

  let mp4Media = path.join(MEDIA, "session-flow.mp4");
  try {
    execSync(
      `ffmpeg -y -i "${srcVideo}" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "${mp4Media}"`,
      { stdio: "pipe" }
    );
    fs.copyFileSync(mp4Media, path.join(ARTIFACTS, "session-flow.mp4"));
  } catch (e) {
    console.warn("ffmpeg mp4 convert failed, keeping webm only");
    mp4Media = null;
  }

  console.log(
    JSON.stringify(
      {
        idlePath,
        activePath,
        billingPath,
        webmMedia,
        mp4Media,
        sizes: {
          idle: fs.statSync(idlePath).size,
          active: fs.statSync(activePath).size,
          billing: fs.statSync(billingPath).size,
          webm: fs.statSync(webmMedia).size,
          mp4: mp4Media && fs.existsSync(mp4Media) ? fs.statSync(mp4Media).size : 0,
        },
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
