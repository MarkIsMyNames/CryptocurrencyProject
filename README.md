# EventTicket DApp

Web3 ticketing system on Ethereum Sepolia Testnet. ERC-20 tickets (ETK) are
purchased with Sepolia ETH (SETH) and burned on venue entry.

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Runtime |
| npm | 10+ | Package manager |
| MetaMask | Latest | Browser wallet |
| Remix IDE | Web app | Smart contract deployment |

---

## 1 — MetaMask Setup

1. Install MetaMask from https://metamask.io
2. Create or import a wallet and note your account address
3. Add the Sepolia testnet manually if it is not already listed:
   - **Network name:** Sepolia
   - **RPC URL:** `https://rpc.sepolia.org`
   - **Chain ID:** `11155111`
   - **Currency symbol:** `ETH`
4. Fund your wallet with test SETH from one of these faucets:
   - https://sepoliafaucet.com
   - https://faucet.quicknode.com/ethereum/sepolia

---

## 2 — Deploy the Smart Contract

The contract lives in `contracts/EventTicket.sol`. Deploy it once via Remix IDE:

1. Open https://remix.ethereum.org
2. Create a new file and paste in the contents of `contracts/EventTicket.sol`
3. Install the OpenZeppelin dependency inside Remix:
   - Open the **npm** panel and install `@openzeppelin/contracts`
4. Go to the **Solidity Compiler** tab:
   - Select compiler version `0.8.20` or later
   - Click **Compile EventTicket.sol**
5. Go to the **Deploy & Run Transactions** tab:
   - Set **Environment** to `Injected Provider - MetaMask`
   - MetaMask will prompt you to connect — approve it on Sepolia
   - Set the constructor arguments:
     - `_maxSupply`: `1000` (maximum tickets available)
     - `_ticketPrice`: `10000000000000000` (0.01 SETH in wei)
   - Click **Deploy** and confirm the MetaMask transaction
6. Copy the deployed contract address from the Remix console

---

## 3 — Project Setup

```bash
# Clone and install dependencies
git clone <repo-url>
cd CryptocurrencyProject
npm install

# Create your environment file
cp .env.example .env
```

Edit `.env` and paste in the contract address from step 2:

```
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

---

## 4 — Running the App

```bash
npm run dev
```

Open http://localhost:5173 in the same browser where MetaMask is installed.

### App pages

| Page | Path | What it does |
|------|------|--------------|
| Create Wallet | `/create-wallet` | Generate a new wallet or connect an existing MetaMask wallet |
| Check Balance | `/balance` | Look up SETH and ETK balance for any address |
| Buy Ticket | `/buy-ticket` | Purchase 1 ETK for 0.01 SETH |
| Redeem Ticket | `/redeem` | Burn your ETK to check in at the event |

### Typical user flow

1. Open **Create Wallet** and connect MetaMask (must be on Sepolia)
2. Open **Check Balance** to confirm your SETH is available
3. Open **Buy Ticket** and click **Buy** — confirm the 0.01 SETH transaction in MetaMask
4. At the venue, open **Redeem Ticket** and click **Redeem** to burn your ETK

---

## 5 — Development Commands

```bash
# Start dev server
npm run dev

# Type-check and build for production
npm run build

# Lint (zero warnings enforced)
npm run lint

# Format all source files
npm run format

# Check formatting without writing
npm run format:check
```

---

## 6 — Testing

```bash
# Run all unit and component tests (Vitest + React Testing Library)
npm test

# Run tests once without watch mode
npx vitest run

# Run tests with coverage report
npx vitest run --coverage

# Open Storybook — component explorer with a11y checks
npm run storybook

# Run end-to-end tests (starts the dev server automatically)
npx playwright test

# Run e2e tests for a single spec file
npx playwright test e2e/balance.spec.ts

# Open the Playwright HTML report after a run
npx playwright show-report
```

---

## 7 — Project Structure

```
src/
  pages/          # One directory per page (tsx + styles + test + stories)
    Balance/
    BuyTicket/
    CreateWallet/
    RedeemTicket/
  context/        # WalletContext — provider, signer, balances
  utils/          # contract.ts — typed wrappers around ethers.js calls
  locales/        # en.json — all user-facing strings
  config.ts       # All configurable values (chain ID, ticket price, etc.)
  theme.ts        # Design tokens — all colours defined here
contracts/
  EventTicket.sol # ERC-20 ticket contract (deploy via Remix)
e2e/              # Playwright end-to-end tests
docs/ai/          # ai-log.md — full AI interaction audit trail
```

---

## 8 — Smart Contract Reference

| Property | Value |
|----------|-------|
| Network | Ethereum Sepolia Testnet |
| Token name | EventTicket |
| Token symbol | ETK |
| Decimals | 0 (1 ETK = 1 ticket, no fractions) |
| Ticket price | 0.01 SETH |
| Max supply | 1 000 |
| Base contracts | OpenZeppelin ERC20, Ownable, ReentrancyGuard |

Contract address is set via `VITE_CONTRACT_ADDRESS` in `.env`. See step 2 above.

---

## AI Declaration

All AI interactions are logged in `docs/ai/ai-log.md` with four-step
traceability: prompt → critique → resolution → commit hash.
