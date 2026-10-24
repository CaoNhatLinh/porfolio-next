import { expect, test } from "@playwright/test";

for (const record of [19, 20, 24]) {
  test(`cockpit note requires twenty points: record ${record}`, async ({ page }) => {
    await page.addInitScript(value => localStorage.setItem("kamling.flappy-orange.best.v1", String(value)), record);
    await page.goto("/playroom?lang=vi");
    const note = page.getByText("Có mảnh giấy trong buồng lái…", { exact: true });
    if (record < 20) {
      await expect(note).toHaveCount(0);
      return;
    }
    await expect(note).toBeVisible();
    await note.click();
    await expect(page.getByText("Đủ 20 rồi. Phi công để lại cho bạn dòng này:")).toBeVisible();
    await page.getByRole("button", { name: "Bắt đầu chơi" }).click();
    await expect(note).toHaveCount(0);
    await expect(page.getByTestId("flight-area")).toHaveAttribute("data-phase", "over", { timeout: 5000 });
    await expect(note).toBeVisible();
    await page.reload();
    await expect(note).toBeVisible();
    await page.goto("/playroom?lang=en");
    await expect(page.getByText("There’s a note in the cockpit…", { exact: true })).toBeVisible();
  });
}
