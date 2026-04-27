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

  test('shows page title and subtitle', async ({ page }) => {
    await page.goto('/buy-ticket')
    await expect(page.getByRole('heading', { name: 'Buy a Ticket' })).toBeVisible()
    await expect(
      page.getByText('Purchase one EventTicket (ETK) token for entry to the event.'),
    ).toBeVisible()
  })

  test('shows tickets remaining label', async ({ page }) => {
    await page.goto('/buy-ticket')
    await expect(page.getByText('Tickets Remaining')).toBeVisible()
  })
})
