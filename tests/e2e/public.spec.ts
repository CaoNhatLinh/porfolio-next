import { expect, test } from "@playwright/test";

test("public portfolio opens in Vietnamese and switches to English", async ({ page }) => {
  await page.goto("/?lang=vi");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Lập trình viên.");
  await expect(page.getByRole("link", { name: "Dự án" }).first()).toBeVisible();
  await page.goto("/work?lang=en");
  await expect(page.getByRole("heading", { name: "Work" })).toBeVisible();
  await expect(page.getByRole("link", { name: "About" }).first()).toBeVisible();
});

test("admin stays private when Supabase is not configured", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login\?next=%2Fadmin|\/login\?next=\/admin/);
  await expect(page.getByRole("heading", { name: "Admin" })).toBeVisible();
});

test("public shell reflows across required viewport sizes", async ({ page }) => {
  test.setTimeout(90_000);
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/?lang=en", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Full-stack developer.");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    if (width < 768) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await expect(page.getByRole("link", { name: "About" }).last()).toBeVisible();
      await page.getByRole("button", { name: "Close navigation" }).click();
    }
  }
});

test("public routes expose one semantic main landmark", async ({ page }) => {
  for (const path of ["/", "/work", "/about", "/journal", "/resume", "/hire", "/contact"]) {
    await page.goto(`${path}?lang=en`);
    await expect(page.locator("main")).toHaveCount(1);
  }
});

test("resume and hire flows are discoverable", async ({ page }) => {
  await page.goto("/resume?lang=en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Cao Nhật Linh");
  await expect(page.getByRole("link", { name: "Hire me" }).first()).toBeVisible();
  await page.goto("/hire?lang=en");
  await expect(page.getByRole("heading", { name: /Let's work together/i })).toBeVisible();
  await expect(page.getByRole("group", { name: "What can I help with?" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send the brief" })).toBeVisible();
});

test("locale switch preserves the current route context", async ({ page }) => {
  await page.goto("/work?lang=vi&category=Web%20application");
  await page.getByRole("link", { name: "Chuyển sang tiếng Anh", exact: true }).first().click();
  await expect(page).toHaveURL(/\/work\?category=Web\+application&lang=en|\/work\?lang=en&category=Web\+application/);
  await expect(page.getByRole("heading", { name: "Work" })).toBeVisible();
});

test("personal toys live in the playroom, not on the homepage", async ({ page }) => {
  await page.goto("/?lang=vi");
  await expect(page.getByRole("button", { name: "Xoay Gaim Capsem 3D" })).toHaveCount(0);
  await expect(page.locator('img[src*="kamen-rider-gaim"]')).toHaveCount(0);
  await expect(page.locator('[data-room-piece]')).toHaveCount(0);
  await page.getByRole("link", { name: "Góc riêng", exact: true }).first().click();
  await expect(page).toHaveURL(/\/playroom\?lang=vi/);
  await expect(page.getByRole("heading", { name: "Một chút vui thôi." })).toBeVisible();
  await expect(page.getByRole("img", { name: "Kamen Rider Gaim pixel animation" })).toHaveAttribute("src", /\.gif$/);
  await expect(page.getByRole("button", { name: "Dừng GIF" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Xoay.*3D/ })).toHaveCount(0);
  await expect(page.locator('[data-room-piece]')).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Flappy Orange." })).toBeVisible();
  await expect(page.getByTestId("flight-area")).toHaveAttribute("data-phase", "ready");
});

test("playroom GIF respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/playroom?lang=en");
  await expect(page.getByRole("img", { name: "Kamen Rider Gaim pixel animation" })).toHaveAttribute("src", /capsem-still\.png$/);
  await expect(page.getByRole("button", { name: "Play GIF" })).toBeVisible();
});

test("playroom animation can be paused and resumed", async ({ page }) => {
  await page.goto("/playroom?lang=vi");
  await page.getByRole("button", { name: "Dừng GIF" }).click();
  await expect(page.getByRole("img", { name: "Kamen Rider Gaim pixel animation" })).toHaveAttribute("src", /capsem-still\.png$/);
  await page.getByRole("button", { name: "Chạy GIF" }).click();
  await expect(page.getByRole("img", { name: "Kamen Rider Gaim pixel animation" })).toHaveAttribute("src", /\.gif$/);
});

test("playroom is reachable on mobile without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/?lang=vi");
  await page.getByRole("button", { name: "Mở menu" }).click();
  await page.getByRole("link", { name: "Góc riêng", exact: true }).click();
  await expect(page).toHaveURL(/\/playroom\?lang=vi/);
  await expect(page.getByRole("heading", { name: "Một chút vui thôi." })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});
