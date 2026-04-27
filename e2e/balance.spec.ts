import { test, expect } from '@playwright/test'

test.describe('Balance Check', () => {
  test('navigates to balance page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Check Balance')
    await expect(page).toHaveURL('/balance')
  })
})
