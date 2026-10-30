import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

async function addTask(
  page: import("@playwright/test").Page,
  title: string,
): Promise<void> {
  await page.getByRole("button", { name: "Add task" }).click();
  await page.getByLabel("Title").fill(title);
  await page.getByRole("button", { name: "Save" }).click();
}

test("shows all tasks and filters pending and done tasks", async ({ page }) => {
  await addTask(page, "Pending task");
  await addTask(page, "Done task");
  await page.getByRole("button", { name: /Done task/ }).click();
  await page.getByRole("button", { name: "Mark as done" }).click();
  await page.getByRole("button", { name: "Back to task list" }).click();

  const allFilter = page.getByRole("button", { name: "All", exact: true });
  const pendingFilter = page.getByRole("button", {
    name: "Pending",
    exact: true,
  });
  const doneFilter = page.getByRole("button", { name: "Done", exact: true });

  await expect(allFilter).toHaveAttribute("aria-pressed", "true");
  await expect(allFilter).toHaveClass(/is-active/);
  await expect(allFilter).toHaveCSS(
    "background-color",
    await page
      .getByRole("button", { name: "Add task" })
      .evaluate((element) => getComputedStyle(element).backgroundColor),
  );
  await expect(page.getByRole("button", { name: /Pending task/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Done task/ })).toBeVisible();

  await pendingFilter.click();
  await expect(pendingFilter).toHaveAttribute("aria-pressed", "true");
  await expect(pendingFilter).toHaveClass(/is-active/);
  await expect(page.getByRole("button", { name: /Pending task/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Done task/ })).toHaveCount(0);

  await doneFilter.click();
  await expect(doneFilter).toHaveAttribute("aria-pressed", "true");
  await expect(doneFilter).toHaveClass(/is-active/);
  await expect(page.getByRole("button", { name: /Done task/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Pending task/ })).toHaveCount(0);
});

test("shows a friendly message when the active filter has no matches", async ({
  page,
}) => {
  await addTask(page, "Finish report");
  await page.getByRole("button", { name: /Finish report/ }).click();
  await page.getByRole("button", { name: "Mark as done" }).click();
  await page.getByRole("button", { name: "Back to task list" }).click();
  await page.getByRole("button", { name: "Pending", exact: true }).click();

  await expect(page.getByText("No pending tasks.")).toBeVisible();
  await expect(page.getByRole("button", { name: /Finish report/ })).toHaveCount(0);
});
