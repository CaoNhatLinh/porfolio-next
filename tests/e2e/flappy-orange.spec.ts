import { expect, test } from "@playwright/test";

test("Flappy Orange starts on demand, pauses, resumes, loses and restarts", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/playroom?lang=vi");
  const game = page.getByTestId("flight-area");
  await expect(game).toHaveAttribute("data-phase", "ready");
  await expect(page.locator('[data-pilot="loaded"]')).toHaveCount(1);
  await page.locator('section[aria-labelledby="flappy-title"]').screenshot({ path: "test-results/flappy-marker-ready.png" });
  await page.getByRole("button", { name: "Bắt đầu chơi" }).click();
  await expect(game).toHaveAttribute("data-phase", "playing");
  await game.press("p");
  await expect(game).toHaveAttribute("data-phase", "paused");
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  await expect(game).toHaveAttribute("data-phase", "playing");
  await game.press("Escape");
  await expect(game).toHaveAttribute("data-phase", "paused");
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  await expect(game).toHaveAttribute("data-phase", "over", { timeout: 5000 });
  await expect(page.getByRole("button", { name: "Chơi lại" })).toBeFocused();
  await page.locator('section[aria-labelledby="flappy-title"]').screenshot({ path: "test-results/flappy-marker-fail.png" });
  await page.getByRole("button", { name: "Chơi lại" }).click();
  await expect(game).toHaveAttribute("data-phase", "playing");
  await expect(page.getByTestId("flight-score")).toHaveText("00");
  await page.locator('section[aria-labelledby="flappy-title"]').screenshot({ path: "test-results/flappy-orange-desktop.png" });
  await game.press("Escape");
  expect(errors).toEqual([]);
});

test("arcade fits all target sizes and keeps localized, keyboard-accessible controls", async ({ page }) => {
  test.setTimeout(90_000);
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/playroom?lang=en");
    const game = page.getByTestId("flight-area");
    await game.scrollIntoViewIfNeeded();
    await expect(game).toHaveAttribute("data-phase", "ready");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await game.focus();
    await game.press("Space");
    await expect(game).toHaveAttribute("data-phase", "playing");
    await game.press("p");
    await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeVisible();
    if (width === 320) await page.screenshot({ path: "test-results/flappy-orange-mobile.png", fullPage: true });
    if (width === 320) {
      await page.getByRole("button", { name: "Resume", exact: true }).click();
      await expect(game).toHaveAttribute("data-phase", "over", { timeout: 5000 });
      const retry = page.getByRole("button", { name: "Play again" });
      const screen = await game.boundingBox();
      const button = await retry.boundingBox();
      expect(button!.y + button!.height).toBeLessThan(screen!.y + screen!.height);
      await game.screenshot({ path: "test-results/flappy-marker-fail-mobile.png" });
    }
  }
});

test("touch gameplay pauses when scrolled away; reduced motion does not autoplay", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/playroom?lang=en");
  const game = page.getByTestId("flight-area");
  await expect(game).toHaveAttribute("data-phase", "ready");
  await page.getByRole("button", { name: "Start playing" }).click();
  await expect(game).toHaveAttribute("data-phase", "playing");
  await game.click({ position: { x: 100, y: 120 } });
  await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded();
  await expect(game).toHaveAttribute("data-phase", "paused");
});
