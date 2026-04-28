import { test, expect } from '@playwright/test'
import en from '../src/locales/en.json' with { type: 'json' }
import { routes } from '../src/config'

test.describe('Redeem Ticket', () => {
  test('shows connect prompt when no wallet connected', async ({ page }) => {
    await page.goto(routes.redeem)
    await expect(page.getByText(en.redeem.connectFirst)).toBeVisible()
  })

  test('shows redeem page title', async ({ page }) => {
    await page.goto(routes.redeem)
    await expect(page.getByRole('heading', { name: en.redeem.title })).toBeVisible()
  })

  test('shows page subtitle', async ({ page }) => {
    await page.goto(routes.redeem)
    await expect(page.getByText(en.redeem.subtitle)).toBeVisible()
  })
})
