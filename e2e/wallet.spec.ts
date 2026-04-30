import { test, expect } from '@playwright/test'
import en from '../src/locales/en.json' with { type: 'json' }
import { routes } from '../src/routes'

test.describe('Wallet — idle step', () => {
  test('redirects root to create-wallet', async ({ page }) => {
    await page.goto(routes.root)
    await expect(page).toHaveURL(routes.createWallet)
  })

  test('shows page title, subtitle and all action buttons', async ({ page }) => {
    await page.goto(routes.createWallet)
    await expect(page.getByRole('heading', { name: en.createWallet.title })).toBeVisible()
    await expect(page.getByText(en.createWallet.subtitle)).toBeVisible()
    await expect(page.getByText(en.createWallet.generateBtn)).toBeVisible()
    await expect(page.getByText(en.createWallet.connectBtn)).toBeVisible()
    await expect(page.getByText(en.createWallet.importKeystoreBtn)).toBeVisible()
  })

  test('shows MetaMask error when Connect clicked without extension', async ({ page }) => {
    await page.goto(routes.createWallet)
    await page.getByText(en.createWallet.connectBtn).click()
    await expect(page.getByText(en.createWallet.metaMaskNotFound)).toBeVisible()
  })
})

test.describe('Wallet — password step', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.createWallet)
    await page.getByText(en.createWallet.generateBtn).click()
  })

  test('shows password and confirm fields', async ({ page }) => {
    await expect(page.getByPlaceholder(en.createWallet.passwordPlaceholder)).toBeVisible()
    await expect(page.getByPlaceholder(en.createWallet.confirmPlaceholder)).toBeVisible()
  })

  test('shows error when password is too short', async ({ page }) => {
    await page.getByPlaceholder(en.createWallet.passwordPlaceholder).fill('short')
    await page.getByPlaceholder(en.createWallet.confirmPlaceholder).fill('short')
    await page.getByText(en.createWallet.nextBtn).click()
    await expect(page.getByText(en.createWallet.passwordMinLength)).toBeVisible()
  })

  test('shows error when passwords do not match', async ({ page }) => {
    await page.getByPlaceholder(en.createWallet.passwordPlaceholder).fill('password123')
    await page.getByPlaceholder(en.createWallet.confirmPlaceholder).fill('different456')
    await page.getByText(en.createWallet.nextBtn).click()
    await expect(page.getByText(en.createWallet.passwordMismatch)).toBeVisible()
  })

  test('password reveal toggle changes input type', async ({ page }) => {
    const pwInput = page.locator('#pw')
    await expect(pwInput).toHaveAttribute('type', 'password')
    await page.getByRole('button', { name: en.createWallet.showPassword }).click()
    await expect(pwInput).toHaveAttribute('type', 'text')
    await page.getByRole('button', { name: en.createWallet.hidePassword }).click()
    await expect(pwInput).toHaveAttribute('type', 'password')
  })

  test('Back returns to idle step', async ({ page }) => {
    await page.getByText(en.createWallet.backBtn).click()
    await expect(page.getByText(en.createWallet.generateBtn)).toBeVisible()
  })
})

test.describe('Wallet — phrase step', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.createWallet)
    await page.getByText(en.createWallet.generateBtn).click()
    await page.getByPlaceholder(en.createWallet.passwordPlaceholder).fill('password123')
    await page.getByPlaceholder(en.createWallet.confirmPlaceholder).fill('password123')
    await page.getByText(en.createWallet.nextBtn).click()
  })

  test('shows 12 mnemonic words', async ({ page }) => {
    await expect(page.getByText(en.createWallet.phraseAcknowledge)).toBeVisible()
    const words = page.getByText(/^\d+\.$/).locator('..')
    await expect(words).toHaveCount(12)
  })

  test('Next is disabled until checkbox checked', async ({ page }) => {
    const nextBtn = page.getByText(en.createWallet.nextBtn)
    await expect(nextBtn).toBeDisabled()
    await page.getByRole('checkbox').check()
    await expect(nextBtn).not.toBeDisabled()
  })

  test('Back returns to password step', async ({ page }) => {
    await page.getByText(en.createWallet.backBtn).click()
    await expect(page.getByPlaceholder(en.createWallet.passwordPlaceholder)).toBeVisible()
  })
})

test.describe('Wallet — verify step', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.createWallet)
    await page.getByText(en.createWallet.generateBtn).click()
    await page.getByPlaceholder(en.createWallet.passwordPlaceholder).fill('password123')
    await page.getByPlaceholder(en.createWallet.confirmPlaceholder).fill('password123')
    await page.getByText(en.createWallet.nextBtn).click()
    await page.getByRole('checkbox').check()
    await page.getByText(en.createWallet.nextBtn).click()
  })

  test('shows three word position inputs', async ({ page }) => {
    const inputs = page.getByPlaceholder(en.createWallet.wordPlaceholder)
    await expect(inputs).toHaveCount(3)
    await expect(page.getByText(/^Word #\d+$/)).toHaveCount(3)
  })

  test('shows error on wrong words', async ({ page }) => {
    const inputs = page.getByPlaceholder(en.createWallet.wordPlaceholder)
    for (let i = 0; i < 3; i++) {
      await inputs.nth(i).fill('wrongword')
    }
    await page.getByText(en.createWallet.verifyBtn).click()
    await expect(page.getByText(en.createWallet.wrongWords)).toBeVisible()
  })

  test('Back returns to phrase step', async ({ page }) => {
    await page.getByText(en.createWallet.backBtn).click()
    await expect(page.getByText(en.createWallet.phraseAcknowledge)).toBeVisible()
  })
})

test.describe('Wallet — keystoreFile step', () => {
  test('shows Load Keystore button on idle screen', async ({ page }) => {
    await page.goto(routes.createWallet)
    await expect(page.getByRole('button', { name: en.createWallet.importKeystoreBtn })).toBeVisible()
  })

  test('navigates to keystore file step when Load Keystore is clicked', async ({ page }) => {
    await page.goto(routes.createWallet)
    await page.getByRole('button', { name: en.createWallet.importKeystoreBtn }).click()
    await expect(page.getByText(en.createWallet.keystoreFileInstruction)).toBeVisible()
  })

  test('shows file input with correct label', async ({ page }) => {
    await page.goto(routes.createWallet)
    await page.getByRole('button', { name: en.createWallet.importKeystoreBtn }).click()
    await expect(page.getByLabel(en.createWallet.keystoreFileLabel)).toBeVisible()
  })

  test('Back returns to idle step', async ({ page }) => {
    await page.goto(routes.createWallet)
    await page.getByRole('button', { name: en.createWallet.importKeystoreBtn }).click()
    await page.getByText(en.createWallet.backBtn).click()
    await expect(page.getByText(en.createWallet.generateBtn)).toBeVisible()
  })

  test('shows error for invalid file type', async ({ page }) => {
    await page.goto(routes.createWallet)
    await page.getByRole('button', { name: en.createWallet.importKeystoreBtn }).click()
    await page.getByLabel(en.createWallet.keystoreFileLabel).setInputFiles({
      name: 'notjson.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('not json'),
    })
    await expect(page.getByText(en.createWallet.keystoreFileError)).toBeVisible()
  })
})

test.describe('Wallet — keystorePassword step', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routes.createWallet)
    await page.getByRole('button', { name: en.createWallet.importKeystoreBtn }).click()
    await page.getByLabel(en.createWallet.keystoreFileLabel).setInputFiles({
      name: 'keystore.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{"version":3,"id":"test"}'),
    })
    await expect(page.getByText(en.createWallet.keystorePasswordInstruction)).toBeVisible()
  })

  test('shows password input', async ({ page }) => {
    await expect(page.getByLabel(en.createWallet.keystorePasswordLabel)).toBeVisible()
  })

  test('shows decrypt button', async ({ page }) => {
    await expect(page.getByRole('button', { name: en.createWallet.keystoreDecryptBtn })).toBeVisible()
  })

  test('Back returns to file step', async ({ page }) => {
    await page.getByText(en.createWallet.backBtn).click()
    await expect(page.getByText(en.createWallet.keystoreFileInstruction)).toBeVisible()
  })

  test('decrypt button is enabled when password is entered', async ({ page }) => {
    await page.getByLabel(en.createWallet.keystorePasswordLabel).fill('somepassword')
    await expect(page.getByRole('button', { name: en.createWallet.keystoreDecryptBtn })).not.toBeDisabled()
  })

  test('shows wrong password error after failed decryption', async ({ page }) => {
    await page.getByLabel(en.createWallet.keystorePasswordLabel).fill('wrongpassword')
    await page.getByRole('button', { name: en.createWallet.keystoreDecryptBtn }).click()
    await expect(page.getByText(en.createWallet.keystorePasswordError)).toBeVisible()
  })
})
