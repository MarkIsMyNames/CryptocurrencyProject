import { test, expect } from '@playwright/test'
import en from '../src/locales/en.json' with { type: 'json' }
import { routes } from '../src/config'

test.describe('Wallet Creation', () => {
  test('navigates to create wallet page from root', async ({ page }) => {
    await page.goto(routes.root)
    await expect(page).toHaveURL(routes.createWallet)
  })

  test('shows generate and connect buttons', async ({ page }) => {
    await page.goto(routes.createWallet)
    await expect(page.getByText(en.createWallet.generateBtn)).toBeVisible()
    await expect(page.getByText(en.createWallet.connectBtn)).toBeVisible()
  })

  test('displays wallet details after generation', async ({ page }) => {
    await page.goto(routes.createWallet)
    await page.getByText(en.createWallet.generateBtn).click()
    await expect(page.getByText(/0x[0-9a-fA-F]+/)).toBeVisible()
    await expect(page.getByText(en.createWallet.downloadBtn)).toBeVisible()
    await expect(page.getByText(en.createWallet.warning)).toBeVisible()
  })

  test('private key is hidden by default', async ({ page }) => {
    await page.goto(routes.createWallet)
    await page.getByText(en.createWallet.generateBtn).click()
    await expect(page.getByText(en.createWallet.revealKey)).toBeVisible()
  })

  test('reveals and hides private key on toggle', async ({ page }) => {
    await page.goto(routes.createWallet)
    await page.getByText(en.createWallet.generateBtn).click()
    await page.getByText(en.createWallet.revealKey).click()
    await expect(page.getByText(en.createWallet.hideKey)).toBeVisible()
    await page.getByText(en.createWallet.hideKey).click()
    await expect(page.getByText(en.createWallet.revealKey)).toBeVisible()
  })

  test('shows page title and subtitle', async ({ page }) => {
    await page.goto(routes.createWallet)
    await expect(page.getByRole('heading', { name: en.createWallet.title })).toBeVisible()
    await expect(page.getByText(en.createWallet.subtitle)).toBeVisible()
  })

  test('shows mnemonic after wallet generation', async ({ page }) => {
    await page.goto(routes.createWallet)
    await page.getByText(en.createWallet.generateBtn).click()
    await expect(page.getByText(en.createWallet.mnemonicLabel, { exact: true })).toBeVisible()
  })
})
