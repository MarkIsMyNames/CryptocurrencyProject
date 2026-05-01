import { customRender, screen, fireEvent, waitFor } from '../../test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import en from '../../locales/en.json'
import * as walletUtils from '../../utils/wallet'
import { CreateWallet } from './CreateWallet'

const mockConnect = vi.fn()
const mockConnectWithWallet = vi.hoisted(() => vi.fn())
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../../context/useWallet', () => ({
  useWallet: () => ({
    connect: mockConnect,
    connectWithWallet: mockConnectWithWallet,
    isConnected: false,
    isConnecting: false,
    error: null,
  }),
}))

vi.mock('../../utils/wallet', () => ({
  generateWallet: vi.fn(),
  downloadKeystore: vi.fn(),
  truncateAddress: vi.fn(),
  loadKeystore: vi.fn(),
  decryptKeystore: vi.fn(),
}))

const MOCK_MNEMONIC = 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12'

function advanceToPasswordStep() {
  customRender(<CreateWallet />)
  fireEvent.click(screen.getByText(en.createWallet.generateBtn))
}

function advanceToPhraseStep() {
  advanceToPasswordStep()
  fireEvent.change(screen.getByLabelText(en.createWallet.passwordLabel), {
    target: { value: 'password123' },
  })
  fireEvent.change(screen.getByLabelText(en.createWallet.confirmLabel), {
    target: { value: 'password123' },
  })
  fireEvent.click(screen.getByText(en.createWallet.nextBtn))
}

function advanceToVerifyStep() {
  advanceToPhraseStep()
  fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.click(screen.getByText(en.createWallet.nextBtn))
}

function fillCorrectVerifyWords() {
  const words = MOCK_MNEMONIC.split(' ')
  const labels = screen
    .getAllByText(/^Word #\d+$/)
    .map((el) => parseInt(el.textContent.replace('Word #', '')) - 1)
  const inputs = screen.getAllByPlaceholderText(en.createWallet.wordPlaceholder)
  labels.forEach((wordIdx, i) => {
    fireEvent.change(inputs[i], { target: { value: words[wordIdx] } })
  })
}

describe('CreateWallet', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    vi.mocked(walletUtils.loadKeystore).mockResolvedValue('{"version":3}')
    vi.mocked(walletUtils.decryptKeystore).mockResolvedValue('0xprivatekey')
    vi.mocked(walletUtils.generateWallet).mockReturnValue({
      address: '0xabc123',
      privateKey: '0xprivatekey',
      mnemonic: MOCK_MNEMONIC,
    })
    mockConnectWithWallet.mockResolvedValue(true)
  })

  describe('idle step', () => {
    it('renders all three action buttons', () => {
      customRender(<CreateWallet />)
      expect(screen.getByText(en.createWallet.generateBtn)).toBeInTheDocument()
      expect(screen.getByText(en.createWallet.connectBtn)).toBeInTheDocument()
      expect(screen.getByText(en.createWallet.importKeystoreBtn)).toBeInTheDocument()
    })
  })

  describe('password step', () => {
    it('shows password fields after clicking Generate', () => {
      advanceToPasswordStep()
      expect(screen.getByLabelText(en.createWallet.passwordLabel)).toBeInTheDocument()
      expect(screen.getByLabelText(en.createWallet.confirmLabel)).toBeInTheDocument()
    })

    it('shows error when password is too short', () => {
      advanceToPasswordStep()
      fireEvent.change(screen.getByLabelText(en.createWallet.passwordLabel), {
        target: { value: 'short' },
      })
      fireEvent.change(screen.getByLabelText(en.createWallet.confirmLabel), {
        target: { value: 'short' },
      })
      fireEvent.click(screen.getByText(en.createWallet.nextBtn))
      expect(screen.getByText(en.createWallet.passwordMinLength)).toBeInTheDocument()
    })

    it('shows error when passwords do not match', () => {
      advanceToPasswordStep()
      fireEvent.change(screen.getByLabelText(en.createWallet.passwordLabel), {
        target: { value: 'password123' },
      })
      fireEvent.change(screen.getByLabelText(en.createWallet.confirmLabel), {
        target: { value: 'different456' },
      })
      fireEvent.click(screen.getByText(en.createWallet.nextBtn))
      expect(screen.getByText(en.createWallet.passwordMismatch)).toBeInTheDocument()
    })

    it('goes back to idle on Back', () => {
      advanceToPasswordStep()
      fireEvent.click(screen.getByText(en.createWallet.backBtn))
      expect(screen.getByText(en.createWallet.generateBtn)).toBeInTheDocument()
    })
  })

  describe('phrase step', () => {
    it('shows all 12 mnemonic words', () => {
      advanceToPhraseStep()
      for (const word of MOCK_MNEMONIC.split(' ')) {
        expect(screen.getByText(word)).toBeInTheDocument()
      }
    })

    it('Next button is disabled until checkbox is checked', () => {
      advanceToPhraseStep()
      const nextBtn = screen.getByText(en.createWallet.nextBtn)
      expect(nextBtn).toBeDisabled()
      fireEvent.click(screen.getByRole('checkbox'))
      expect(nextBtn).not.toBeDisabled()
    })
  })

  describe('verify step', () => {
    it('shows word position inputs', () => {
      advanceToVerifyStep()
      const inputs = screen.getAllByPlaceholderText(en.createWallet.wordPlaceholder)
      expect(inputs).toHaveLength(3)
    })

    it('shows error on wrong words', () => {
      advanceToVerifyStep()
      const inputs = screen.getAllByPlaceholderText(en.createWallet.wordPlaceholder)
      for (const input of inputs) {
        fireEvent.change(input, { target: { value: 'wrongword' } })
      }
      fireEvent.click(screen.getByText(en.createWallet.verifyBtn))
      expect(screen.getByText(en.createWallet.wrongWords)).toBeInTheDocument()
    })

    it('connects and shows complete step on correct words', async () => {
      advanceToVerifyStep()
      fillCorrectVerifyWords()
      fireEvent.click(screen.getByText(en.createWallet.verifyBtn))
      await waitFor(() => {
        expect(screen.getByText(en.createWallet.walletCreated)).toBeInTheDocument()
      })
    })
  })

  describe('complete step', () => {
    it('shows wallet address and action buttons after verification', async () => {
      advanceToVerifyStep()
      fillCorrectVerifyWords()
      fireEvent.click(screen.getByText(en.createWallet.verifyBtn))
      await waitFor(() => {
        expect(screen.getByText('0xabc123')).toBeInTheDocument()
        expect(screen.getByText(en.createWallet.downloadBtn)).toBeInTheDocument()
        expect(screen.getByText(en.createWallet.goToBalance)).toBeInTheDocument()
      })
    })
  })

  describe('Wallet — keystoreFile step', () => {
    it('shows keystore file screen when Load Keystore is clicked', () => {
      customRender(<CreateWallet />)
      fireEvent.click(screen.getByText(en.createWallet.importKeystoreBtn))
      expect(screen.getByText(en.createWallet.keystoreFileInstruction)).toBeInTheDocument()
    })

    it('Back returns to idle step', () => {
      customRender(<CreateWallet />)
      fireEvent.click(screen.getByText(en.createWallet.importKeystoreBtn))
      fireEvent.click(screen.getByText(en.createWallet.backBtn))
      expect(screen.getByText(en.createWallet.generateBtn)).toBeInTheDocument()
    })

    it('shows file error when an invalid file is selected', async () => {
      vi.mocked(walletUtils.loadKeystore).mockRejectedValueOnce(new Error('Not a JSON file'))
      customRender(<CreateWallet />)
      fireEvent.click(screen.getByText(en.createWallet.importKeystoreBtn))
      const file = new File(['not json'], 'notjson.txt', { type: 'text/plain' })
      fireEvent.change(screen.getByLabelText(en.createWallet.keystoreFileLabel), {
        target: { files: [file] },
      })
      expect(await screen.findByText(en.createWallet.keystoreFileError)).toBeInTheDocument()
    })
  })

  describe('Wallet — keystorePassword step', () => {
    function advanceToKeystorePasswordStep() {
      customRender(<CreateWallet />)
      fireEvent.click(screen.getByText(en.createWallet.importKeystoreBtn))
      const file = new File(['{"version":3}'], 'ks.json', { type: 'application/json' })
      fireEvent.change(screen.getByLabelText(en.createWallet.keystoreFileLabel), {
        target: { files: [file] },
      })
    }

    it('advances to password screen after valid file is selected', async () => {
      advanceToKeystorePasswordStep()
      expect(
        await screen.findByText(en.createWallet.keystorePasswordInstruction),
      ).toBeInTheDocument()
    })

    it('Back returns to file step', async () => {
      advanceToKeystorePasswordStep()
      await screen.findByText(en.createWallet.keystorePasswordInstruction)
      fireEvent.click(screen.getByText(en.createWallet.backBtn))
      expect(await screen.findByText(en.createWallet.keystoreFileInstruction)).toBeInTheDocument()
    })

    it('shows wrong password error when decryption fails', async () => {
      vi.mocked(walletUtils.decryptKeystore).mockRejectedValueOnce(new Error('invalid password'))
      advanceToKeystorePasswordStep()
      await screen.findByText(en.createWallet.keystorePasswordInstruction)
      fireEvent.change(screen.getByLabelText(en.createWallet.keystorePasswordLabel), {
        target: { value: 'wrongpassword' },
      })
      fireEvent.click(screen.getByText(en.createWallet.keystoreDecryptBtn))
      expect(await screen.findByText(en.createWallet.keystorePasswordError)).toBeInTheDocument()
    })

    it('shows connecting state while decrypting', async () => {
      vi.mocked(walletUtils.decryptKeystore).mockImplementationOnce(() => new Promise(() => {}))
      advanceToKeystorePasswordStep()
      await screen.findByText(en.createWallet.keystorePasswordInstruction)
      fireEvent.change(screen.getByLabelText(en.createWallet.keystorePasswordLabel), {
        target: { value: 'somepassword' },
      })
      fireEvent.click(screen.getByText(en.createWallet.keystoreDecryptBtn))
      const connectingBtn = screen.getByText(en.createWallet.connecting)
      expect(connectingBtn).toBeInTheDocument()
      expect(connectingBtn).toBeDisabled()
    })

    it('shows success message on idle after successful decrypt', async () => {
      advanceToKeystorePasswordStep()
      await screen.findByText(en.createWallet.keystorePasswordInstruction)
      fireEvent.change(screen.getByLabelText(en.createWallet.keystorePasswordLabel), {
        target: { value: 'correctpassword' },
      })
      fireEvent.click(screen.getByText(en.createWallet.keystoreDecryptBtn))
      expect(await screen.findByText(en.createWallet.keystoreConnected)).toBeInTheDocument()
    })
  })
})
