import { test, expect } from '@playwright/test'

test.describe('Buy Ticket', () => {
  test('shows connect prompt when no wallet connected', async ({ page }) => {
    await page.goto('/buy-ticket')
    await expect(
      page.getByText('Please connect your wallet first.'),
    ).toBeVisible()
  })

  test('shows ticket price label', async ({ page }) => {
    await page.goto('/buy-ticket')
    await expect(page.getByText('Ticket Price')).toBeVisible()
  })
})
