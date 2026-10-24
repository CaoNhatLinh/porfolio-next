import { expect, test } from "@playwright/test";

test("industrial reward layout works in both locales at four widths", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Exercise presentation states; actual answer verification has its own end-to-end test.
  await page.route("**/api/orange-protocol/attempts", route => route.fulfill({ json: { ok: true, reward: "night-orchard" } }));
  for (const locale of ["en", "vi"]) {
    await page.goto(`/playroom?lang=${locale}`);
    const protocol = page.locator(".orange-protocol");
    if (locale === "en") {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await protocol.screenshot({ path: "test-results/protocol-industrial-locked.png" });
      await page.getByLabel("The code you found").fill("ABCDEFGH-AB");
      await page.getByRole("button", { name: "Try code" }).click();
    }
    await expect(protocol).toHaveAttribute("data-solved", "true");
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      const controls = protocol.getByRole("group").getByRole("button");
      await controls.first().click();
      await expect(controls.first()).toHaveAttribute("aria-pressed", "true");
      await controls.last().focus();
      await page.keyboard.press("Enter");
      await expect(controls.last()).toHaveAttribute("aria-pressed", "true");
      const bounds = await controls.last().boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      if (width === 320 || width === 1440) {
        await protocol.getByRole("heading", { level: 3 }).click();
        await protocol.screenshot({ path: `test-results/protocol-industrial-${locale}-${width}.png` });
      }
    }
  }
  expect(errors).toEqual([]);
});
