import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/PFF Draft Simulator/);
});

test('has start draft button', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const button = await page.getByText('Start Draft');
  await expect(button).toBeVisible();
});