import { expect, test } from "@playwright/test";

const projects = ["novachat", "social-publishing-platform", "squareup", "tutor-connect", "zing-music", "motorcycle-store", "bus-management"];

test("case studies use specific first-person copy in both languages", async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const lang of ["vi", "en"]) {
    for (const slug of projects) {
      await page.goto(`/work/${slug}?lang=${lang}`);
      await expect(page.locator("main")).not.toContainText(/năng lực thể hiện|bề mặt thao tác|Strength on display|Tested throughout the build/i);
      await expect(page.locator("main")).toContainText(lang === "vi" ? "Quá trình làm dự án." : "Building the project.");
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    }
  }
  expect(errors).toEqual([]);
});

test("revised copy fits mobile and removed mock article routes are unavailable", async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 375, height: 812 });
  for (const path of ["/", "/about", "/resume", "/hire", "/work/bus-management", "/journal"]) {
    await page.goto(`${path}?lang=vi`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  for (const slug of ["clarity-in-complex-systems", "type-safety-as-a-design-tool", "animations-that-serve-function"]) {
    await page.goto(`/journal/${slug}?lang=vi`);
    // Streamed notFound responses can start with HTTP 200; verify the page state.
    await expect(page.getByRole("heading", { name: "Not found" })).toBeVisible();
    await expect(page.locator("article")).toHaveCount(0);
  }
  await page.goto("/admin/articles/new?starter=booking-seat-state");
  await expect(page).toHaveURL(/\/login\?/);
  await expect(page.locator('[name="bodyVi"]')).toHaveCount(0);
});
