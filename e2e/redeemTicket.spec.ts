import { test, expect } from '@playwright/test'

test.describe('Redeem Ticket', () => {
  test('navigates to redeem page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Redeem Ticket')
    await expect(page).toHaveURL('/redeem')
  })
})
