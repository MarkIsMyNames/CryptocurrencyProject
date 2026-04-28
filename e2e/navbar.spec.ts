import { test, expect } from '@playwright/test'
import en from '../src/locales/en.json' with { type: 'json' }
import { routes } from '../src/config'

test.describe('Navbar', () => {
  test('renders brand and all nav links', async ({ page }) => {
    await page.goto(routes.createWallet)
    await expect(page.getByText('EventTicket')).toBeVisible()
    await expect(page.getByRole('link', { name: en.nav.createWallet })).toBeVisible()
    await expect(page.getByRole('link', { name: en.nav.balance })).toBeVisible()
    await expect(page.getByRole('link', { name: en.nav.buyTicket })).toBeVisible()
    await expect(page.getByRole('link', { name: en.nav.redeem })).toBeVisible()
  })

  test('navigates to balance page via nav link', async ({ page }) => {
    await page.goto(routes.createWallet)
    await page.getByRole('link', { name: en.nav.balance }).click()
    await expect(page).toHaveURL(routes.balance)
  })

  test('navigates to buy ticket page via nav link', async ({ page }) => {
    await page.goto(routes.createWallet)
    await page.getByRole('link', { name: en.nav.buyTicket }).click()
    await expect(page).toHaveURL(routes.buyTicket)
  })

  test('navigates to redeem page via nav link', async ({ page }) => {
    await page.goto(routes.createWallet)
    await page.getByRole('link', { name: en.nav.redeem }).click()
    await expect(page).toHaveURL(routes.redeem)
  })
})
