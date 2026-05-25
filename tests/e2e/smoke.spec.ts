import { expect, test } from "@playwright/test";

test("homepage loads the Between the Lines shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Between the Lines" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Insights", exact: true })).toBeVisible();
});
