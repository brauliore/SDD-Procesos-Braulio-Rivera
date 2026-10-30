import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("shows the named app and a friendly empty state", async ({ page }) => {
  await expect(page).toHaveTitle("Curso-PSWE-07");
  await expect(
    page.getByRole("heading", { name: "Curso-PSWE-07" }),
  ).toBeVisible();
  await expect(page.getByText("No tasks yet. Add one to get started.")).toBeVisible();
});

test("creates a task, opens its detail, and retains it after reload", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Add task" }).click();
  await page.getByLabel("Title").fill("  Buy groceries  ");
  await page.getByLabel("Description").fill("Milk and bread");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByRole("button", { name: /Buy groceries/ })).toBeVisible();
  await page.getByRole("button", { name: /Buy groceries/ }).click();
  await expect(page.getByRole("heading", { name: "Buy groceries" })).toBeVisible();
  await expect(page.getByText("Milk and bread")).toBeVisible();
  await expect(page.getByText("Pending", { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("button", { name: /Buy groceries/ })).toBeVisible();
});

test("rejects a blank title and displays the no-description label", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Add task" }).click();
  await page.getByLabel("Title").fill("   ");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Title is required.")).toBeVisible();

  await page.getByLabel("Title").fill("Walk");
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: /Walk/ }).click();
  await expect(page.getByText("No description")).toBeVisible();
});

async function expectCurrentScreenMeetsVisualRequirements(
  page: Page,
): Promise<void> {
  const measurements = await page.evaluate(() => {
    const controls = Array.from(
      document.querySelectorAll<HTMLElement>("button, input, textarea"),
    ).map((element) => {
      const bounds = element.getBoundingClientRect();
      return { width: bounds.width, height: bounds.height };
    });

    const parseColor = (value: string) => {
      const components = value.match(/[\d.]+/g)?.map(Number);
      if (!components || components.length < 3) {
        throw new Error(`Unsupported computed color: ${value}`);
      }
      return components.slice(0, 3);
    };

    const luminance = (color: number[]) => {
      const channels = color.map((component) => {
        const value = component / 255;
        return value <= 0.04045
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4;
      });
      return (
        0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!
      );
    };

    const inputValue = (element: HTMLElement): string => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) {
        return element.value;
      }
      return "";
    };

    const text = Array.from(
      document.querySelectorAll<HTMLElement>(
        "h1, h2, p, label, button, input, textarea, .task-status, .task-description, .task-title",
      ),
    )
      .filter((element) => element.textContent?.trim() || inputValue(element).trim())
      .map((element) => {
        const style = getComputedStyle(element);
        let ancestor: HTMLElement | null = element;
        let background = "rgb(255, 255, 255)";
        while (ancestor) {
          const candidate = getComputedStyle(ancestor).backgroundColor;
          if (!candidate.startsWith("rgba") || Number(candidate.split(",")[3]) > 0) {
            background = candidate;
            break;
          }
          ancestor = ancestor.parentElement;
        }
        const foregroundLuminance = luminance(parseColor(style.color));
        const backgroundLuminance = luminance(parseColor(background));
        const ratio =
          (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
          (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
        const fontSize = Number.parseFloat(style.fontSize);
        const isBold = Number.parseInt(style.fontWeight, 10) >= 700;
        return {
          text: element.textContent?.trim() || inputValue(element).trim(),
          ratio,
          minimum: fontSize >= 24 || (fontSize >= 18.66 && isBold) ? 3 : 4.5,
        };
      });

    return {
      pageWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      controls,
      text,
      backgroundLuminance: luminance(
        parseColor(getComputedStyle(document.body).backgroundColor),
      ),
      fontFamilies: Array.from(
        document.querySelectorAll<HTMLElement>(
          "h1, h2, p, label, button, input, textarea",
        ),
      )
        .filter((element) => element.offsetParent !== null)
        .map((element) => getComputedStyle(element).fontFamily),
      titleDescription: (() => {
        const title = document.querySelector<HTMLElement>(".detail-title");
        const description =
          document.querySelector<HTMLElement>(".task-description");
        if (!title || !description) {
          return null;
        }
        return {
          titleSize: Number.parseFloat(getComputedStyle(title).fontSize),
          descriptionSize: Number.parseFloat(
            getComputedStyle(description).fontSize,
          ),
          titleWeight: Number.parseInt(getComputedStyle(title).fontWeight, 10),
          descriptionWeight: Number.parseInt(
            getComputedStyle(description).fontWeight,
            10,
          ),
        };
      })(),
    };
  });

  expect(measurements.pageWidth).toBeLessThanOrEqual(
    measurements.viewportWidth,
  );
  expect(measurements.controls.length).toBeGreaterThan(0);
  expect(measurements.backgroundLuminance).toBeGreaterThan(0.8);
  expect(new Set(measurements.fontFamilies).size).toBeLessThanOrEqual(1);
  for (const control of measurements.controls) {
    expect(control.width).toBeGreaterThanOrEqual(44);
    expect(control.height).toBeGreaterThanOrEqual(44);
  }
  for (const item of measurements.text) {
    expect(item.ratio, `Contrast for "${item.text}"`).toBeGreaterThanOrEqual(
      item.minimum,
    );
  }
  if (measurements.titleDescription) {
    expect(measurements.titleDescription.titleSize).toBeGreaterThan(
      measurements.titleDescription.descriptionSize,
    );
    expect(measurements.titleDescription.titleWeight).toBeGreaterThan(
      measurements.titleDescription.descriptionWeight,
    );
  }
}

test("keeps controls usable and text readable at mobile and desktop widths", async ({
  page,
}) => {
  for (const viewport of [
    { width: 360, height: 800 },
    { width: 1280, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await expectCurrentScreenMeetsVisualRequirements(page);
    await page.getByRole("button", { name: "Add task" }).click();
    await expectCurrentScreenMeetsVisualRequirements(page);
    await page.getByLabel("Title").fill("Contrast check");
    await page.getByLabel("Description").fill("Readable description");
    await page.getByRole("button", { name: "Save" }).click();
    await expectCurrentScreenMeetsVisualRequirements(page);
    await page.getByRole("button", { name: /Contrast check/ }).click();
    await expectCurrentScreenMeetsVisualRequirements(page);
    await page.getByRole("button", { name: "Edit" }).click();
    await expectCurrentScreenMeetsVisualRequirements(page);
  }
});
