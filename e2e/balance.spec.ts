import { test, expect } from '@playwright/test'
import en from '../src/locales/en.json' with { type: 'json' }
import { routes } from '../src/config'

test.describe('Balance Check — page structure', () => {
  test('shows page title and subtitle', async ({ page }) => {
    await page.goto(routes.balance)
    await expect(page.getByRole('heading', { name: en.balance.title })).toBeVisible()
    await expect(page.getByText(en.balance.subtitle)).toBeVisible()
  })

  test('shows balance page with address input and check button', async ({ page }) => {
    await page.goto(routes.balance)
    await expect(page.getByPlaceholder(en.balance.placeholder)).toBeVisible()
    await expect(page.getByRole('button', { name: en.balance.checkBtn })).toBeVisible()
  })

  test('check button is enabled on page load', async ({ page }) => {
    await page.goto(routes.balance)
    await expect(page.getByRole('button', { name: en.balance.checkBtn })).toBeEnabled()
  })
})

test.describe('Balance Check — validation', () => {
  test('shows invalid address error for bad input', async ({ page }) => {
    await page.goto(routes.balance)
    await page.getByPlaceholder(en.balance.placeholder).fill('notanaddress')
    await page.getByRole('button', { name: en.balance.checkBtn }).click()
    await expect(page.getByText(en.balance.invalidAddress)).toBeVisible()
  })

  test('shows invalid address error for empty submission', async ({ page }) => {
    await page.goto(routes.balance)
    await page.getByPlaceholder(en.balance.placeholder).clear()
    await page.getByRole('button', { name: en.balance.checkBtn }).click()
    await expect(page.getByText(en.balance.invalidAddress)).toBeVisible()
  })

  test('shows invalid address error for partial hex input', async ({ page }) => {
    await page.goto(routes.balance)
    await page.getByPlaceholder(en.balance.placeholder).fill('0x123')
    await page.getByRole('button', { name: en.balance.checkBtn }).click()
    await expect(page.getByText(en.balance.invalidAddress)).toBeVisible()
  })

  test('does not show error on page load before any submission', async ({ page }) => {
    await page.goto(routes.balance)
    await expect(page.getByText(en.balance.invalidAddress)).not.toBeVisible()
    await expect(page.getByText(en.errors.unknownError)).not.toBeVisible()
  })
})

test.describe('Balance Check — no wallet connected', () => {
  test('shows connect wallet error when submitting a valid address without MetaMask', async ({
    page,
  }) => {
    await page.goto(routes.balance)
    await page.getByPlaceholder(en.balance.placeholder).fill('0x1234567890abcdef1234567890abcdef12345678')
    await page.getByRole('button', { name: en.balance.checkBtn }).click()
    await expect(
      page.getByText(en.errors.connectWallet).or(page.getByText(en.errors.unknownError)),
    ).toBeVisible()
  })
})

test.describe('Balance Check — result cards', () => {
  test('result cards are not shown before a check is performed', async ({ page }) => {
    await page.goto(routes.balance)
    await expect(page.getByText(en.balance.sethLabel)).not.toBeVisible()
    await expect(page.getByText(en.balance.etkLabel)).not.toBeVisible()
    await expect(page.getByText(en.balance.supplyLabel)).not.toBeVisible()
  })
})

test.describe('Balance Check — navigation', () => {
  test('balance page is reachable via navbar', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /balance/i }).click()
    await expect(page).toHaveURL(routes.balance)
    await expect(page.getByRole('heading', { name: en.balance.title })).toBeVisible()
  })
})
