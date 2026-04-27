import { test, expect } from '@playwright/test'

test.describe('Buy Ticket', () => {
  test('navigates to buy ticket page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Buy Ticket')
    await expect(page).toHaveURL('/buy-ticket')
  })
})
