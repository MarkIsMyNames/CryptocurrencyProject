import { test, expect } from '@playwright/test'
import en from '../src/locales/en.json'
import { routes } from '../src/config'

test.describe('Balance Check', () => {
  test('shows balance page with address input', async ({ page }) => {
    await page.goto(routes.balance)
    await expect(page.getByPlaceholder(en.balance.placeholder)).toBeVisible()
    await expect(page.getByRole('button', { name: en.balance.checkBtn })).toBeVisible()
  })

  test('shows invalid address error for bad input', async ({ page }) => {
    await page.goto(routes.balance)
    await page.getByPlaceholder(en.balance.placeholder).fill('notanaddress')
    await page.getByRole('button', { name: en.balance.checkBtn }).click()
    await expect(page.getByText(en.balance.invalidAddress)).toBeVisible()
  })

  test('shows invalid address error for empty submission', async ({ page }) => {
    await page.goto(routes.balance)
    await page.getByRole('button', { name: en.balance.checkBtn }).click()
    await expect(page.getByText(en.balance.invalidAddress)).toBeVisible()
  })

  test('shows page title and subtitle', async ({ page }) => {
    await page.goto(routes.balance)
    await expect(page.getByRole('heading', { name: en.balance.title })).toBeVisible()
    await expect(page.getByText(en.balance.subtitle)).toBeVisible()
  })
})
