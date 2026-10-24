import { expect, test } from "@playwright/test";

test("manual desk supports keyboard ordering, bit switches and mobile layout", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("kamling.orange-protocol.op-1.fragments", JSON.stringify([
    { folio: "home", fragment: "001:11100111" }, { folio: "work", fragment: "000:11100100" },
  ])));
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/playroom?lang=en");
  await page.getByText("Field notes", { exact: true }).click();
  await page.getByRole("button", { name: "Move up work", exact: true }).focus();
  await page.keyboard.press("Enter");
  for (const bit of [7, 5, 2, 0]) await page.getByRole("button", { name: `Bit ${bit}`, exact: true }).click();
  await expect(page.getByLabel("Decoded preview")).toHaveText("AB");
  await expect(page.getByRole("button", { name: "Move up work", exact: true })).toBeDisabled();
  await page.locator('.orange-protocol ol li').first().dragTo(page.locator('.orange-protocol ol li').last());
  await expect(page.getByLabel("Decoded preview")).toHaveText("BA");
  await page.getByRole("button", { name: "Move up work", exact: true }).click();
  await page.locator(".orange-protocol").screenshot({ path: "test-results/protocol-workbench-mobile.png" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await page.setViewportSize({ width: 320, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test("public pages share one passive particle layer; reduced motion stays static", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/work", "/about", "/journal", "/resume", "/hire", "/contact", "/playroom", "/"]) {
    await page.goto(route);
    const network = page.locator("[data-particle-network]");
    await expect(network).toHaveCount(1);
    await expect(network).toHaveAttribute("data-state", "static");
    await expect(network).toHaveCSS("pointer-events", "none");
  }
});

test("blocked storage reports failed saves honestly and Escape returns focus", async ({ page }) => {
  await page.addInitScript(() => {
    const save = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.includes("fragments") || key.endsWith(".reward")) throw new DOMException("Blocked", "SecurityError");
      save.call(this, key, value);
    };
  });
  await page.goto('/playroom?lang=en');
  await page.getByRole('button', { name: 'Start exploring', exact: true }).click();
  const mark = page.getByRole('button', { name: 'Inspect mark', exact: true });
  await mark.click();
  for (let turn = 0; turn < 3; turn++) await page.getByRole('button', { name: 'Turn one step' }).click();
  await page.getByRole('button', { name: 'Record fragment', exact: true }).click();
  await expect(page.getByText('Couldn’t save. Copy the code above to keep it.')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(mark).toBeFocused();
  // Isolate the UI's storage failure handling from server answer validation (covered separately).
  await page.route('**/api/orange-protocol/attempts', route => route.fulfill({ json: { ok: true, reward: 'night-orchard' } }));
  await page.getByLabel('The code you found').fill('ABCDEFGH-AB');
  await page.getByRole('button', { name: 'Try code' }).click();
  await expect(page.getByText('Browser storage is blocked. Rewards still work until you leave this page.')).toBeVisible();
  await page.getByRole('button', { name: 'Close reward', exact: true }).click();
  await expect(page.getByRole('button', { name: 'View unlocked rewards' })).toBeFocused();
});
