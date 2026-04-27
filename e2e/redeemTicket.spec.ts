import { test, expect } from '@playwright/test'

test.describe('Redeem Ticket', () => {
  test('shows connect prompt when no wallet connected', async ({ page }) => {
    await page.goto('/redeem')
    await expect(
      page.getByText('Please connect your wallet to redeem.'),
    ).toBeVisible()
  })

  test('shows redeem page title', async ({ page }) => {
    await page.goto('/redeem')
    await expect(
      page.getByRole('heading', { name: 'Redeem Ticket' }),
    ).toBeVisible()
  })
})
