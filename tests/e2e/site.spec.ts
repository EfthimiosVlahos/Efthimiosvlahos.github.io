import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  "/",
  "/about",
  "/experience",
  "/projects",
  "/skills",
  "/off-the-clock",
  "/projects/pyxeon",
  "/projects/insurance-document-ai",
  "/projects/energy-utility",
  "/projects/trader-hub",
];

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

for (const route of ROUTES) {
  test(`${route} renders without errors and passes axe`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    // Let entrance animations finish so contrast is measured on final colors.
    await page.waitForTimeout(1200);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.length} node(s), e.g. ${v.nodes[0]?.target}`)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("navigation reaches a case study and back", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await page.getByRole("link", { name: "A trading agent that has to earn live access" }).click();
  await expect(page.locator("h1")).toHaveText("A trading agent that has to earn live access");
  await page.getByRole("link", { name: "Projects" }).first().click();
  await expect(page).toHaveURL(/\/projects$/);
});

test("theme defaults to dark and the toggle persists across reloads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Switch to light mode" }).first().click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("the simulate-before-ship lab reaches the recorded verdicts", async ({ page }) => {
  await page.goto("/projects/insurance-document-ai#simulate");
  const lab = page.locator("#simulate");
  await lab.getByRole("button", { name: "Replay on stored cases" }).click();
  await expect(lab.getByText("Ship it")).toBeVisible();
  await lab.getByLabel("Looser unit-number matching").check();
  await lab.getByRole("button", { name: "Replay on stored cases" }).click();
  await expect(lab.getByText("Don’t ship")).toBeVisible();
  await expect(lab.getByText("Would approve 21 cases reviewers rejected", { exact: false })).toBeVisible();
});

test("the skills constellation links a skill to where it was used", async ({ page }) => {
  await page.goto("/skills");
  await page.getByRole("button", { name: "LangGraph: show where I used it" }).focus();
  const info = page.locator("[aria-live=polite]").filter({ hasText: "LangGraph" }).first();
  await expect(info).toContainText("Con Edison");
  await expect(info).toContainText("Trader Hub");
});

test("the hard-fail explainer holds a missing liability limit for review", async ({ page }) => {
  await page.goto("/projects/insurance-document-ai");
  const box = page.locator("text=Try it: which checks does this policy pass?").locator("..");
  await expect(box.getByText("Auto-approved")).toBeVisible();
  await expect(box.getByText("Sent to manual review")).toBeVisible();
  await box.getByLabel("Liability meets the property’s minimum").check();
  await expect(box.getByText("Sent to manual review")).toHaveCount(0);
});

test("the graduation gate unlocks only when every bar clears", async ({ page }) => {
  await page.goto("/projects/trader-hub");
  await expect(page.getByText("Paper trading only")).toBeVisible();
  await page.getByLabel(/Sharpe ratio/).fill("1.2");
  await expect(page.getByText("Paper trading only")).toBeVisible();
  await page.getByLabel(/Days of paper trading/).fill("120");
  await expect(page.getByText("Live trading unlocked")).toBeVisible();
});

test("ask the ancients answers from the texts and shows its work", async ({ page }) => {
  await page.goto("/off-the-clock");
  await page.getByRole("button", { name: "I hate getting out of bed in the morning" }).click();
  await expect(page.getByText("Book V, 1", { exact: false })).toBeVisible();
  await expect(page.getByText("1. Tokens")).toBeVisible();
  await page.getByLabel("Ask the ancients a question").fill("how do I deal with anger");
  await page.getByRole("button", { name: "Ask", exact: true }).click();
  await expect(page.locator("blockquote mark").first()).toBeVisible();
});

test("the xG pitch responds to clicks, keys and presets", async ({ page }) => {
  await page.goto("/off-the-clock");
  const value = page.locator(".gradient-text").filter({ hasText: /^0\.\d\d$/ });
  await page.getByRole("button", { name: "Six-yard box" }).click();
  const close = Number(await value.textContent());
  await page.getByRole("button", { name: "From distance" }).click();
  const far = Number(await value.textContent());
  expect(close).toBeGreaterThan(far);
  await page.getByRole("application").focus();
  await page.keyboard.press("ArrowUp");
  await page.getByRole("button", { name: "Take 100 shots from here" }).click();
  await expect(page.getByText(/goals from 100 shots/)).toBeVisible();
});

test("the eval gate ships routing and blocks auto-refunds", async ({ page }) => {
  await page.goto("/#method");
  const lab = page.locator("#method");
  await lab.getByRole("button", { name: "Run the eval" }).click();
  await expect(lab.getByText("✓ Ship it")).toBeVisible({ timeout: 5000 });
  await lab.getByLabel("Let the agent issue refunds without approval").check();
  await lab.getByRole("button", { name: "Run the eval" }).click();
  await expect(lab.getByText("✗ Blocked")).toBeVisible({ timeout: 5000 });
  await expect(lab.getByText("3 found; must be zero")).toBeVisible();
});

test("unknown pages get the 404 page", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByText("This page doesn’t exist")).toBeVisible();
});

test("résumé download is served @mobile", async ({ request }) => {
  const res = await request.get("/Efthimios_Vlahos_Resume.pdf");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("pdf");
});

test("mobile menu opens, navigates and closes @mobile", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.locator("#mobile-nav").getByRole("link", { name: "Professional Experience" }).click();
  await expect(page).toHaveURL(/\/experience$/);
  await expect(page.locator("#mobile-nav")).toHaveCount(0);
});

for (const route of ["/", "/projects/insurance-document-ai", "/skills", "/off-the-clock"]) {
  test(`${route} passes axe in light mode`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.waitForTimeout(1200);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.length} node(s), e.g. ${v.nodes[0]?.target}`)).toEqual([]);
  });
}
