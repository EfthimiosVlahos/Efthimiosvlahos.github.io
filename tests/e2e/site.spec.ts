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

// Netlify inserts a promotional comment and a line break into <head> on production. Without cleanup, React reads
// them as a hydration mismatch (error #418) and re-renders every page from scratch.
for (const route of ["/", "/off-the-clock"]) {
  test(`${route} hydrates cleanly with Netlify's injected head comment`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.route((url) => url.pathname === route, async (r) => {
      const res = await r.fetch();
      const html = (await res.text()).replace(
        '<meta charSet="utf-8"/>',
        '<meta charSet="utf-8"/>\n<!-- This site is hosted on Netlify. Anyone can build and deploy a site\n     like this one for free. -->',
      );
      await r.fulfill({ response: res, body: html });
    });
    await page.goto(route);
    await page.waitForTimeout(1500);
    expect(errors).toEqual([]);
  });
}

test("navigation reaches a case study and back", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await page.getByRole("link", { name: "Trader Hub" }).click();
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
  await page.getByRole("searchbox", { name: "Ask the ancients a question" }).fill("how do I deal with anger");
  await page.getByRole("button", { name: "Ask", exact: true }).click();
  await expect(page.locator("blockquote mark").first()).toBeVisible();
});

test("the solar system shows a planet and links to its section", async ({ page }) => {
  await page.goto("/off-the-clock");
  // Planets move, so select by keyboard: focusing one also pauses the orbits.
  await page.getByRole("button", { name: /^Soccer:/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText(/Sunday league on the weekend, Real Madrid the rest of the week/).first()).toBeVisible();
  await page.getByRole("link", { name: "Go there" }).click();
  await expect(page).toHaveURL(/#soccer$/);
});

test("keepy-uppy starts and counts a touch", async ({ page }) => {
  await page.goto("/off-the-clock#soccer");
  const game = page.getByRole("application", { name: /Keepy-uppy/ });
  // Start and kick in one synchronous step, so a slow machine can't let the ball land in between.
  // A press before hydration does nothing, so retry until the touch counts.
  await expect(async () => {
    await game.evaluate((el) => {
      for (let i = 0; i < 2; i++) el.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    });
    await expect(page.getByText(/^Touches:/)).toContainText("1", { timeout: 500 });
  }).toPass();
});

test("picking a lift loads its plate milestone and a word on leg day", async ({ page }) => {
  await page.goto("/off-the-clock#gym");
  await page.getByRole("button", { name: "Deadlift" }).click();
  await expect(page.getByText("405 lb")).toBeVisible();
  await page.getByRole("button", { name: "Squat" }).click();
  await expect(page.getByText(/Leg day\. Never skipped/)).toBeVisible();
});

test("the one-rep max formulas agree at ten reps", async ({ page }) => {
  await page.goto("/off-the-clock#gym");
  await page.getByLabel("Weight on the bar").fill("200");
  await page.getByLabel("Reps you got").fill("10");
  await expect(page.locator("[aria-live=polite]").filter({ hasText: /^Epley/ })).toHaveText(/Epley\s*265\s*Brzycki\s*265/);
});

test("the double pendulums part ways and can be released again", async ({ page }) => {
  await page.goto("/off-the-clock#physics");
  await expect(page.getByText(/They parted ways after \d+\.\d seconds/)).toBeVisible({ timeout: 15_000 });
  const smaller = page.getByRole("button", { name: "1 / 1,000,000 rad" });
  await smaller.click();
  await expect(smaller).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Watching for the moment they part ways…")).toBeVisible();
});

test("the globe flies between Greece and Long Island", async ({ page }) => {
  await page.goto("/off-the-clock#roots");
  const li = page.getByRole("button", { name: "Long Island", exact: true });
  await li.click();
  await expect(li).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "The whole arc" })).toHaveAttribute("aria-pressed", "false");
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
  await page.locator("#mobile-nav").getByRole("link", { name: "Experience" }).click();
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
