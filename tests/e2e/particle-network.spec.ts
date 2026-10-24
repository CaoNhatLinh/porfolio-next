import { expect, test } from "@playwright/test";

test("particle background responds to the mouse without intercepting links", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?lang=en", { waitUntil: "domcontentloaded" });
  const network = page.locator("[data-particle-network]").first();
  await expect(network).toHaveAttribute("data-state", "active");
  await expect(network.locator("canvas")).toBeVisible();
  expect(await network.evaluate((element) => getComputedStyle(element).pointerEvents)).toBe("none");
  await page.mouse.move(700, 350);
  await page.screenshot({ path: "test-results/particle-network-desktop.png" });
  await page.getByRole("link", { name: "View the work", exact: true }).click();
  await expect(page).toHaveURL(/\/work\?lang=en/);
  expect(errors).toEqual([]);
});

test("reduced motion uses static dots rather than an animated canvas", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/contact?lang=vi", { waitUntil: "domcontentloaded" });
  const network = page.locator("[data-particle-network]");
  await expect(network).toHaveAttribute("data-state", "static");
  await expect(network.locator("canvas")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Liên hệ");
});

test("the shared background remains visible after scrolling and across public navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?lang=en", { waitUntil: "domcontentloaded" });
  const network = page.locator("[data-particle-network]").first();
  await expect(network).toHaveAttribute("data-state", "active");
  await page.getByRole("heading", { name: "Understand the work. Then write the code." }).scrollIntoViewIfNeeded();
  await expect(network).toHaveAttribute("data-state", "active");
  await expect(page.locator('[data-particle-network]')).toHaveCount(1);
  await page.goto('/work?lang=en');
  await expect(network).toHaveAttribute('data-state', 'active');
  await page.mouse.move(850, 180);
  await page.screenshot({ path: 'test-results/particle-network-work.png' });
  await page.goto('/contact?lang=en');
  await expect(network).toHaveAttribute('data-state', 'active');
  await page.screenshot({ path: 'test-results/particle-network-contact.png' });
});
