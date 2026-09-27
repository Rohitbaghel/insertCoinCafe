const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const MEDIA = "/cursor/stores/self/media";
const ARTIFACTS = "/opt/cursor/artifacts";

async function main() {
  fs.mkdirSync(MEDIA, { recursive: true });
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const videoDir = path.join(ARTIFACTS, "pw-video-user");
  fs.rmSync(videoDir, { recursive: true, force: true });
  fs.mkdirSync(videoDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: videoDir, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  page.on("pageerror", (err) => console.error("PAGEERROR", err.message));

  await page.goto("http://127.0.0.1:43127/play", { waitUntil: "networkidle" });
  await page.waitForSelector("text=Game on.");
  await page.waitForTimeout(800);

  const homePath = path.join(MEDIA, "user-side-demo.png");
  await page.screenshot({ path: homePath, fullPage: false });
  await page.screenshot({
    path: path.join(ARTIFACTS, "user-side-demo.png"),
    fullPage: false,
  });

  await page.getByRole("link", { name: "Book a Slot" }).first().click();
  await page.waitForURL("**/play/login**");
  await page.waitForSelector("text=Log in to book");
  await page.waitForTimeout(400);

  const loginPath = path.join(MEDIA, "user-login-demo.png");
  await page.screenshot({ path: loginPath, fullPage: false });
  await page.screenshot({
    path: path.join(ARTIFACTS, "user-login-demo.png"),
    fullPage: false,
  });

  await page.getByPlaceholder("98765 43210").fill("9876543210");
  await page.getByRole("button", { name: "Send OTP" }).click();
  await page.waitForSelector("text=Enter the code");
  await page.getByLabel("6-digit code").fill("123456");
  await page.getByRole("button", { name: "Verify & Continue" }).click();
  await page.waitForURL("**/play/book**");
  await page.waitForSelector("text=Book a slot");
  await page.waitForTimeout(600);

  // Select zone + slot
  const zoneBtn = page.locator("button").filter({ hasText: "PS3" }).first();
  await zoneBtn.click();
  await page.locator("button").filter({ hasText: "Today" }).first().click();
  const slot = page
    .locator("button.choice, button.c-choice")
    .filter({ hasText: /AM|PM/ })
    .filter({ hasNot: page.locator("[disabled]") })
    .first();
  // Fallback: click first enabled slot-looking button in step 03 area
  const slots = page.locator("button").filter({ hasText: /–/ });
  const count = await slots.count();
  for (let i = 0; i < count; i++) {
    if (await slots.nth(i).isEnabled()) {
      await slots.nth(i).click();
      break;
    }
  }
  await page.waitForTimeout(400);

  const bookPath = path.join(MEDIA, "user-book-demo.png");
  await page.screenshot({ path: bookPath, fullPage: false });
  await page.screenshot({
    path: path.join(ARTIFACTS, "user-book-demo.png"),
    fullPage: false,
  });

  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await page.waitForSelector("text=Slot booked!");
  await page.waitForTimeout(500);

  const confirmPath = path.join(MEDIA, "user-booking-confirmed-demo.png");
  await page.screenshot({ path: confirmPath, fullPage: false });
  await page.screenshot({
    path: path.join(ARTIFACTS, "user-booking-confirmed-demo.png"),
    fullPage: false,
  });

  await page.getByRole("link", { name: "My Points" }).click();
  await page.waitForSelector("text=My points");
  await page.waitForTimeout(500);

  const rewardsPath = path.join(MEDIA, "user-rewards-demo.png");
  await page.screenshot({ path: rewardsPath, fullPage: false });
  await page.screenshot({
    path: path.join(ARTIFACTS, "user-rewards-demo.png"),
    fullPage: false,
  });

  await context.close();
  await browser.close();

  const videos = fs
    .readdirSync(videoDir)
    .filter((f) => f.endsWith(".webm"))
    .map((f) => ({ f, size: fs.statSync(path.join(videoDir, f)).size }))
    .sort((a, b) => b.size - a.size);
  if (!videos.length || videos[0].size < 1000) throw new Error("No video");
  const src = path.join(videoDir, videos[0].f);
  fs.copyFileSync(src, path.join(MEDIA, "user-side-flow.webm"));
  fs.copyFileSync(src, path.join(ARTIFACTS, "user-side-flow.webm"));
  execSync(
    `ffmpeg -y -i "${src}" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "${path.join(MEDIA, "user-side-flow.mp4")}"`,
    { stdio: "pipe" }
  );
  fs.copyFileSync(
    path.join(MEDIA, "user-side-flow.mp4"),
    path.join(ARTIFACTS, "user-side-flow.mp4")
  );

  const files = [
    homePath,
    loginPath,
    bookPath,
    confirmPath,
    rewardsPath,
    path.join(MEDIA, "user-side-flow.mp4"),
  ];
  console.log(
    JSON.stringify(
      Object.fromEntries(files.map((p) => [path.basename(p), fs.statSync(p).size])),
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
