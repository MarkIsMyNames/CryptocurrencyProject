import { test, expect } from '@playwright/test'

test.describe('Wallet Creation', () => {
  test('navigates to create wallet page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Create Wallet')
    await expect(page).toHaveURL('/create-wallet')
  })
})
