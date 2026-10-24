import { expect, test } from "@playwright/test";

test("eight public clues can be decoded to unlock and toggle the night orchard", async ({ page }) => {
  test.setTimeout(120000);
  const pieces: { index: number; letter: string }[] = [];
  await page.goto('/playroom?lang=en');
  await page.getByRole('button', { name: 'Start exploring', exact: true }).click();
  for (const route of ["/", "/work", "/about", "/journal", "/resume", "/hire", "/contact", "/playroom"]) {
    await page.goto(`${route}?lang=en`);
    const mark = page.locator('[data-op-fragment]');
    await expect(mark).toHaveCount(1);
    const [tag, value] = (await mark.getAttribute("data-op-fragment"))!.split(":");
    let gray = parseInt(tag, 2); let index = 0;
    while (gray) { index ^= gray; gray >>= 1; }
    pieces.push({ index, letter: String.fromCharCode(parseInt(value, 2) ^ 0b10100101) });
    await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem("kamling.orange-protocol.op-1.fragments") ?? "[]").length)).toBe(pieces.length - 1);
    await page.getByRole('button', { name: 'Inspect mark', exact: true }).click();
    for (let turn = 0; turn < 3; turn++) await page.getByRole('button', { name: 'Turn one step' }).click();
    await page.getByRole('button', { name: 'Record fragment', exact: true }).click();
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem("kamling.orange-protocol.op-1.fragments") ?? "[]").length)).toBe(pieces.length);
  }
  const leaf = await page.locator('[data-leaf]').getAttribute('data-leaf');
  const answer = pieces.sort((a, b) => a.index - b.index).map(piece => piece.letter).join("") + "-" + parseInt(leaf!, 2).toString(16);
  await page.getByLabel("The code you found").fill(answer);
  await page.getByRole("button", { name: "Try code" }).click();
  await expect(page.getByText("You found it.", { exact: true })).toBeVisible();
  await expect(page.locator('[data-theme="night"]')).toHaveCount(1);
  await expect(page.locator('[data-skin="armor"]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Classic Orange' }).click();
  await expect(page.locator('[data-skin="classic"]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Citrus Armor' }).click();
  await page.locator('section[aria-labelledby="flappy-title"]').screenshot({ path: "test-results/flappy-orange-night.png" });
  await page.getByRole("button", { name: "Switch to daylight" }).click();
  await expect(page.locator('[data-theme="day"]')).toHaveCount(1);
  await page.locator('section[aria-labelledby="flappy-title"]').screenshot({ path: "test-results/flappy-orange-day.png" });
  await page.getByRole("button", { name: "Close reward" }).click();
  await expect(page.getByRole('button', { name: 'View unlocked rewards' })).toBeVisible();
  await page.reload();
  await expect(page.getByText('You found it.', { exact: true })).toBeVisible();
  await expect(page.locator('[data-theme="day"][data-skin="armor"]')).toHaveCount(1);
  await page.locator('.orange-protocol').screenshot({ path: 'test-results/protocol-rewards-desktop.png' });
  await page.getByText("Field notes", { exact: true }).click();
  await expect(page.locator(".orange-protocol details li")).toHaveCount(8);
});
