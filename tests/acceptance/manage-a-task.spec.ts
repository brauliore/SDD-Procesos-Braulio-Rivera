import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "Add task" }).click();
  await page.getByLabel("Title").fill("Read");
  await page.getByLabel("Description").fill("A chapter");
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: /Read/ }).click();
});

test("edits task details and cancel discards unsaved changes", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Title").fill("  Read daily  ");
  await page.getByLabel("Description").fill("Two chapters");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("heading", { name: "Read daily" })).toBeVisible();
  await expect(page.getByText("Two chapters")).toBeVisible();

  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Title").fill("Discard this change");
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByRole("heading", { name: "Read daily" })).toBeVisible();
  await expect(page.getByText("Discard this change")).toHaveCount(0);
});

test("rejects a blank edit title without changing the saved task", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Title").fill("   ");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Title is required.")).toBeVisible();
  await expect(page.getByLabel("Title")).toHaveAttribute("aria-invalid", "true");
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByRole("heading", { name: "Read" })).toBeVisible();
});

test("toggles status and requires confirmation before deletion", async ({
  page,
}) => {
  const deleteButton = page.getByRole("button", { name: "Delete" });
  const deleteColor = await deleteButton.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  const primaryColor = await page
    .getByRole("button", { name: "Mark as done" })
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(deleteColor).not.toBe(primaryColor);

  await page.getByRole("button", { name: "Mark as done" }).click();
  await expect(page.getByText("Done", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Mark as not done" })).toBeVisible();

  await page.getByRole("button", { name: "Back to task list" }).click();
  const completedRow = page.getByRole("button", { name: /Read, Done/ });
  await expect(completedRow.locator(".task-title")).toHaveCSS(
    "text-decoration-line",
    "line-through",
  );
  await expect(completedRow.locator(".task-title")).not.toHaveCSS(
    "color",
    "rgb(23, 32, 51)",
  );
  await completedRow.click();

  await page.getByRole("button", { name: "Mark as not done" }).click();
  await expect(page.getByRole("button", { name: "Mark as done" })).toBeVisible();

  page.once("dialog", (dialog) => dialog.dismiss());
  await deleteButton.click();
  await expect(page.getByRole("heading", { name: "Read" })).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await deleteButton.click();
  await expect(page.getByText("No tasks yet. Add one to get started.")).toBeVisible();
});
