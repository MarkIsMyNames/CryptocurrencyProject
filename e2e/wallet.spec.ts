import { test, expect } from '@playwright/test'

test.describe('Wallet Creation', () => {
  test('navigates to create wallet page from root', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/create-wallet')
  })

  test('shows generate and connect buttons', async ({ page }) => {
    await page.goto('/create-wallet')
    await expect(page.getByText('Generate New Wallet')).toBeVisible()
    await expect(page.getByText('Connect MetaMask')).toBeVisible()
  })

  test('displays wallet details after generation', async ({ page }) => {
    await page.goto('/create-wallet')
    await page.getByText('Generate New Wallet').click()
    await expect(page.getByText(/0x[0-9a-fA-F]+/)).toBeVisible()
    await expect(page.getByText('Download Keystore')).toBeVisible()
    await expect(
      page.getByText(
        'Save your recovery phrase and private key somewhere safe. They cannot be recovered if lost.',
      ),
    ).toBeVisible()
  })

  test('private key is hidden by default', async ({ page }) => {
    await page.goto('/create-wallet')
    await page.getByText('Generate New Wallet').click()
    await expect(page.getByText('Reveal Private Key')).toBeVisible()
  })

  test('reveals and hides private key on toggle', async ({ page }) => {
    await page.goto('/create-wallet')
    await page.getByText('Generate New Wallet').click()
    await page.getByText('Reveal Private Key').click()
    await expect(page.getByText('Hide Private Key')).toBeVisible()
    await page.getByText('Hide Private Key').click()
    await expect(page.getByText('Reveal Private Key')).toBeVisible()
  })

  test('shows page title and subtitle', async ({ page }) => {
    await page.goto('/create-wallet')
    await expect(
      page.getByRole('heading', { name: 'Create or Connect Wallet' }),
    ).toBeVisible()
    await expect(
      page.getByText('Generate a new Ethereum wallet or connect your existing MetaMask.'),
    ).toBeVisible()
  })

  test('shows mnemonic after wallet generation', async ({ page }) => {
    await page.goto('/create-wallet')
    await page.getByText('Generate New Wallet').click()
    await expect(page.getByText('Recovery Phrase')).toBeVisible()
  })
})
