# EventTicket DApp

Web3 ticketing system on Ethereum Sepolia Testnet. ERC-20 tickets (ETK) are
purchased with SETH and burned at venue entry.

---

## Report

### Code Overview

The project is a full-stack Web3 DApp split into a Solidity smart contract and a
React frontend.

**Smart Contract — `contracts/EventTicket.sol`**

`EventTicket` is an ERC-20 token where 1 ETK equals 1 ticket. It inherits from
OpenZeppelin's `ERC20`, `Ownable`, and `ReentrancyGuard`. Key design choices:

| Detail | Value |
|---|---|
| Token symbol | ETK |
| Decimals | 0 (overridden) — 1 ETK is always 1 whole ticket |
| Ticket price | Set at deploy time via constructor; stored as `immutable` |
| Max supply | Set at deploy time via constructor; stored as `immutable` |
| Non-transferable | `_update` reverts unless the operation is a mint or burn |
| Reentrancy | `nonReentrant` guard on `buyTicket` and `withdrawFunds` |

Public functions:

- `buyTicket()` — payable; mints 1 ETK to the caller if payment matches
  `ticketPrice`, the caller holds no existing ticket, and supply remains.
- `redeemTicket()` — burns the caller's single ETK to record venue entry.
- `remainingTickets()` — view; returns `maxSupply - totalSupply()`.
- `withdrawFunds()` — owner only; transfers the contract balance to the owner
  address.

**Frontend — `src/`**

Built with React 19, TypeScript (strict), Vite, and styled-components v6.

```
src/
├── config.ts              — all env-driven constants (address, price, chain ID)
├── locales/en.json        — all user-facing strings
├── theme.ts               — design tokens (colours, spacing, typography)
├── context/
│   ├── useWallet.ts       — WalletContext: MetaMask + keystore connection state
│   └── WalletContext.tsx  — provider component
├── utils/
│   └── contract.ts        — typed ethers v6 contract wrapper + error decoder
├── components/
│   ├── Navbar/            — top navigation bar with wallet status indicator
│   ├── WalletStatus/      — connected address badge (truncated, copy-on-click)
│   └── TxReceipt/         — transaction hash with Etherscan link
└── pages/
    ├── CreateWallet/      — multi-step wizard: generate phrase → verify → connect
    │   ├── PhraseStep/    — displays generated 12-word mnemonic
    │   ├── VerifyStep/    — asks user to confirm three random words
    │   ├── PasswordStep/  — encrypts wallet to keystore JSON
    │   ├── CompleteStep/  — shows success and redirects
    │   ├── KeystoreFileStep/   — file-picker for existing keystore
    │   └── KeystorePasswordStep/ — password entry + decryption
    ├── BuyTicket/         — shows price, remaining supply, and buy button
    ├── RedeemTicket/      — shows ticket balance and redeem button
    └── Balance/           — displays connected wallet ETH and ETK balances
```

Wallet connection supports MetaMask (browser extension) and keystore JSON files.
The connected signer and provider are held in a single React context so all pages
share live balance state. All contract calls are wrapped in `src/utils/contract.ts`,
which maps ethers error codes to user-facing strings from `en.json`.

**Testing**

- Unit / component tests: Vitest + React Testing Library
- Component explorer + accessibility: Storybook 10 with `addon-a11y` (WCAG 2.1 AA)
- E2E: Playwright

---

### Design Description

All user-facing strings live in `src/locales/en.json`. No text is hardcoded in JSX.
All configurable values (contract address, ticket price, max supply, chain ID, RPC
URL) come from environment variables read through `src/config.ts`.

---

#### Contract Deployment

> A successful deployment of the `EventTicket` contract.

**Transaction:** `https://sepolia.etherscan.io/tx/0xYOUR_DEPLOY_TX_HASH`
**Contract address:** `https://sepolia.etherscan.io/address/0xYOUR_CONTRACT_ADDRESS`

---

#### Ticket Purchase

> A successful call to `buyTicket()` that mints 1 ETK to the purchaser.

**Transaction:** `https://sepolia.etherscan.io/tx/0xYOUR_BUY_TX_HASH`

---

## Prerequisites

- Node.js 20+
- npm 10+
- MetaMask browser extension (or a keystore JSON file)

## MetaMask Setup

1. Install MetaMask from https://metamask.io
2. Create or import a wallet
3. Add the Sepolia testnet:
   - Click the network dropdown → "Add a custom network"
   - Network name: Sepolia
   - RPC URL: https://ethereum-sepolia-rpc.publicnode.com
   - Chain ID: 11155111
   - Currency: ETH
4. Get test SETH from a faucet:
   - https://cloud.google.com/application/web3/faucet/ethereum/sepolia (Google account)
   - https://www.alchemy.com/faucets/ethereum-sepolia (free Alchemy account)
   - https://sepolia-faucet.pk910.de (no account — mines in browser)

## Installation

```bash
npm install
```

## Environment Setup

Copy `.env.example` to `.env` and fill in the deployed contract address:

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_CONTRACT_ADDRESS=0xYourContractAddressHere
VITE_MAX_SUPPLY=1000
VITE_TICKET_PRICE_WEI=10000000000000000
VITE_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

`VITE_MAX_SUPPLY` and `VITE_TICKET_PRICE_WEI` must match the values used when the
contract was deployed. The defaults (1000 tickets, 0.01 SETH) are pre-filled in
`.env.example`.

## Deploying the Contract

1. Export your MetaMask private key: MetaMask → Account Details → Show Private Key
2. Add to `.env`:

```
VITE_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
DEPLOY_PRIVATE_KEY=0xYourPrivateKeyHere
VITE_MAX_SUPPLY=1000
VITE_TICKET_PRICE_WEI=10000000000000000
```

3. Run:

```bash
npm run deploy
```

This compiles the contract, deploys it to Sepolia, and automatically updates
`VITE_CONTRACT_ADDRESS` in your `.env`.

4. Restart the dev server so Vite picks up the new address:

```bash
npm run dev
```

> **Note:** The deploying wallet must hold SETH for gas fees. Top it up via a
> faucet before running this command.

## Viewing Transactions

After buying a ticket the app displays the transaction hash with a direct link to
Sepolia Etherscan. To look up any transaction manually:

1. Go to https://sepolia.etherscan.io
2. Paste the transaction hash (starting with `0x`) into the search bar

## Running Tests

```bash
# Unit tests
npx vitest run

# Unit tests with coverage
npx vitest run --coverage

# Storybook component explorer + a11y checks
npm run storybook

# Storybook tests (headless)
npx vitest run --project=storybook

# E2E tests (requires dev server on :5173)
npx playwright test

# Lint
npm run lint

# Format check
npm run format:check
```

## Smart Contract

- **Network:** Ethereum Sepolia Testnet (chain ID 11155111)
- **Standard:** ERC-20 (OpenZeppelin v5)
- **Source:** `contracts/EventTicket.sol`
- **Deploy:** `npm run deploy`

## AI Declaration

All AI interactions are logged in `docs/ai/ai-log.md` with full four-step
traceability (prompt → critique → resolution → commit hash).
