import { test, expect } from '@playwright/test'

test.describe('Balance Check', () => {
  test('shows balance page with address input', async ({ page }) => {
    await page.goto('/balance')
    await expect(
      page.getByPlaceholder('Enter wallet address (0x...)'),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Check Balance' }),
    ).toBeVisible()
  })

  test('shows invalid address error for bad input', async ({ page }) => {
    await page.goto('/balance')
    await page
      .getByPlaceholder('Enter wallet address (0x...)')
      .fill('notanaddress')
    await page.getByRole('button', { name: 'Check Balance' }).click()
    await expect(
      page.getByText('Please enter a valid Ethereum address.'),
    ).toBeVisible()
  })

  test('shows invalid address error for empty submission', async ({ page }) => {
    await page.goto('/balance')
    await page.getByRole('button', { name: 'Check Balance' }).click()
    await expect(
      page.getByText('Please enter a valid Ethereum address.'),
    ).toBeVisible()
  })

  test('shows page title and subtitle', async ({ page }) => {
    await page.goto('/balance')
    await expect(page.getByRole('heading', { name: 'Wallet Balance' })).toBeVisible()
    await expect(
      page.getByText('Look up any wallet to check its SETH and ticket balance.'),
    ).toBeVisible()
  })
})
