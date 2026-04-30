import { test, expect } from '@playwright/test'
import en from '../src/locales/en.json' with { type: 'json' }
import { routes } from '../src/routes'

test.describe('Buy Ticket', () => {
  test('shows connect prompt when no wallet connected', async ({ page }) => {
    await page.goto(routes.buyTicket)
    await expect(page.getByText(en.buyTicket.connectFirst)).toBeVisible()
  })

  test('shows ticket price label', async ({ page }) => {
    await page.goto(routes.buyTicket)
    await expect(page.getByText(en.buyTicket.priceLabel)).toBeVisible()
  })

  test('shows page title and subtitle', async ({ page }) => {
    await page.goto(routes.buyTicket)
    await expect(page.getByRole('heading', { name: en.buyTicket.title })).toBeVisible()
    await expect(page.getByText(en.buyTicket.subtitle)).toBeVisible()
  })
})
