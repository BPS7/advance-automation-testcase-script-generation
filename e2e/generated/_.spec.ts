import { test, expect } from "@playwright/test";

test.describe("Generated tests for /", () => {
  test("Verify that the login page renders with the correct elements.", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await expect(page.getByRole('heading', { name: 'Login 🔐' })).toBeVisible()
    await expect(page.getByPlaceholder('Username')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
    // Expectation: 
  });
  test("Submit the login form with valid credentials.", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByPlaceholder('Username').fill('admin')
    await page.getByPlaceholder('Password').fill('password123')
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page.getByText('Welcome to Dashboard')).toBeVisible();
    // Expectation: 
  });
  test("Attempt to submit the login form without a username.", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByPlaceholder('Password').fill('validPassword')
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page.getByText('Welcome to Dashboard ✨')).toBeVisible()
    // Expectation: 
  });
  test("Attempt to submit the login form without a password.", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByPlaceholder('Username').fill('validUsername')
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page.getByText('Invalid username or password')).toBeVisible()
    // Expectation: 
  });
});

