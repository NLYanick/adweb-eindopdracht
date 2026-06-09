import { expect, test as setup } from "@playwright/test";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

const testName = `User ${Date.now()}`;
const testEmail = `user-${Date.now()}@example.com`;
const testPassword = "TestPassword123";

setup("register user", async ({ page }) => {
  await page.goto(`${baseUrl}/auth/login`);
  await page.getByRole("link", { name: "Register" }).click();

  await expect(page).toHaveTitle(/Budgetbook/);

  await page.fill("#name", testName);
  await page.fill("#email", testEmail);
  await page.fill("#password", testPassword);

  await page.getByRole("button", { name: "Create account" }).click();
});

setup("authenticate", async ({ page }) => {
  await page.goto(`${baseUrl}/auth/login`);

  await page.getByLabel("Email").fill(testEmail);
  await page.getByLabel("Password").fill(testPassword);

  await page.getByRole("button", { name: "Login" }).click();

  // await page.waitForURL(baseUrl);

  await page.context().storageState({
    path: "__tests__/playwright/.auth/user.json",
  });
});