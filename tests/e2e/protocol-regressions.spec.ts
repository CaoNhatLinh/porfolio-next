import { expect, test } from "@playwright/test";

test("exploration opt-out synchronizes between tabs without changing public content", async ({ page, context }) => {
  await page.goto('/playroom?lang=en');
  await page.getByRole('button', { name: 'Start exploring', exact: true }).click();
  const second = await context.newPage();
  await second.goto('/playroom?lang=en');
  await second.getByRole('button', { name: 'Stop exploring', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Start exploring', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Inspect mark', exact: true })).toHaveCount(0);
});

test("the clue panel fits short screens and focus survives successful recording", async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 320 });
  await page.goto('/playroom?lang=vi');
  await page.getByRole('button', { name: 'Bắt đầu tìm manh mối', exact: true }).click();
  const mark = page.getByRole('button', { name: 'Kiểm tra dấu khắc', exact: true });
  await mark.click();
  const panel = page.getByRole('complementary', { name: 'Orange Protocol' });
  const bounds = await panel.boundingBox();
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(320);
  for (let step = 0; step < 3; step++) await page.getByRole('button', { name: 'Xoay một nấc' }).click();
  await expect(page.getByRole('button', { name: 'Ghi lại mảnh này', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(panel.getByRole('button', { name: 'Đóng', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(mark).toBeFocused();
});

test("CV print omits clues and particles; project details retain the shared backdrop", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/resume?lang=vi');
  await expect(page.locator('[data-op-fragment]')).toHaveCount(1);
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
  await expect(page.locator('.site-ambient')).toBeHidden();
  await expect(page.locator('[data-op-fragment]')).toBeHidden();
  await expect(page.locator('main')).toBeVisible();
  await page.screenshot({ path: 'test-results/resume-print-clean.png', fullPage: true });
  await page.emulateMedia({ media: 'screen', reducedMotion: 'reduce' });
  await page.goto('/work/bus-management?lang=vi');
  await expect(page.locator('[data-particle-network]')).toHaveCount(1);
  await expect(page.locator('[data-particle-network]')).toHaveAttribute('data-state', 'static');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.screenshot({ path: 'test-results/project-detail-backdrop.png' });
});
