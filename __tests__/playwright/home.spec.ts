import { test, expect } from '@playwright/test';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

test('has title and heading', async ({ page }) => {
  await page.goto(baseUrl);

  await expect(page).toHaveTitle(/Budgetbook/);

  await expect(page.getByRole('heading', { name: 'Budgeting Made Simple' })).toBeVisible();
});

test('open budgetbooks link', async ({ page }) => {
  await page.goto(baseUrl);

  await page.getByRole('link', { name: 'Open Budget Books' }).click();

  await expect(page.getByRole('heading', { name: 'Budget Books' })).toBeVisible();
});
