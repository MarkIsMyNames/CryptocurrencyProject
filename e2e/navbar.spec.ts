import { test, expect } from '@playwright/test'

test.describe('Navbar', () => {
  test('renders brand and all nav links', async ({ page }) => {
    await page.goto('/create-wallet')
    await expect(page.getByText('EventTicket')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Create Wallet' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Check Balance' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Buy Ticket' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Redeem Ticket' })).toBeVisible()
  })

  test('navigates to balance page via nav link', async ({ page }) => {
    await page.goto('/create-wallet')
    await page.getByRole('link', { name: 'Check Balance' }).click()
    await expect(page).toHaveURL('/balance')
  })

  test('navigates to buy ticket page via nav link', async ({ page }) => {
    await page.goto('/create-wallet')
    await page.getByRole('link', { name: 'Buy Ticket' }).click()
    await expect(page).toHaveURL('/buy-ticket')
  })

  test('navigates to redeem page via nav link', async ({ page }) => {
    await page.goto('/create-wallet')
    await page.getByRole('link', { name: 'Redeem Ticket' }).click()
    await expect(page).toHaveURL('/redeem')
  })
})
