# EventTicket DApp

Web3 ticketing system on Ethereum Sepolia Testnet. ERC-20 tickets (ETK) are
purchased with SETH and burned at venue entry.

---

## Report

### Code Overview

The project is a full-stack Web3 DApp. The on-chain logic lives in a single
Solidity contract; the interface is a React SPA that communicates with
it through ethers.js. The two halves are deliberately kept independent: the
contract knows nothing about the frontend, and the frontend treats the contract
as a pure API it calls over JSON-RPC.

#### Smart Contract — `contracts/EventTicket.sol`

| Detail | Value |
|---|---|
| Token symbol | ETK — using an ERC-20 token means wallets like MetaMask can display balances natively without custom integration |
| Decimals | 0 (overridden) — 1 ETK is always 1 whole ticket; fractional tickets have no meaning in this domain |
| Ticket price | Set at deploy time via constructor; stored as `immutable` so the compiler bakes it into the bytecode rather than a storage slot, saving a storage read on every `buyTicket` call |
| Max supply | Set at deploy time via constructor; also `immutable` — `remainingTickets()` subtracts `totalSupply()` from this value on every read |
| Non-transferable | `_update` (the OZ v5 internal transfer hook) reverts unless the caller is address zero (mint) or the recipient is address zero (burn) — one interception point covers both `transfer` and `transferFrom` |
| Reentrancy | `nonReentrant` guard on `buyTicket` and `withdrawFunds` because both transfer ETH; without it a malicious contract could re-enter before the state update commits and drain funds |
| Errors | Custom errors (`IncorrectPayment`, `AlreadyOwnsTicket`, `SoldOut`, …) rather than `require` strings — 4-byte selector payload costs less gas and gives the frontend a machine-readable signal to map to a friendly message |

Public interface:

| Function | Access | Purpose |
|---|---|---|
| `buyTicket()` | anyone | Pays `ticketPrice` SETH, mints 1 ETK |
| `redeemTicket()` | ticket holder | Burns the caller's ETK to record entry |
| `remainingTickets()` | view | Returns `maxSupply − totalSupply()` |
| `withdrawFunds()` | owner only | Transfers collected SETH to the owner |

#### Frontend — `src/`

Built with React 19, TypeScript, Vite, and styled-components v6.

The architecture separates concerns into four layers that flow in one direction:

```
env / config.ts  →  context (useWallet)  →  utils/contract.ts  →  pages / components
```

**Configuration layer (`config.ts`, `locales/en.json`, `theme.ts`, `.env`)**
All environment-specific values (contract address, price, chain ID, RPC URL)
are read from `.env` through `config.ts` and kept out of component code. All
user-facing text lives in `locales/en.json`. This means changing the ticket
price, the network, or any displayed string requires editing one file.

**Wallet context (`context/useWallet.ts`, `WalletContext.tsx`)**
Connection state (address, ETH balance, ETK balance, signer, provider) is held
in a single React context that wraps the entire app. Pages do not manage wallet
state themselves; they read from the context and call `refreshBalances()` after
a transaction confirms. This means the Navbar's wallet indicator, the Balance
page, and the BuyTicket page all stay in sync automatically without separate fetch logic.

Two connection paths share the same context interface: MetaMask (browser
extension, `BrowserProvider`) and keystore JSON (file upload + password decrypt,
`Wallet`). Unifying them behind the same `signer`/`provider` shape means the
rest of the app does not need to know which method was used.

**Contract utility (`utils/contract.ts`)**
All ethers calls are wrapped in typed functions (`buyTicket`, `redeemTicket`,
`remainingTickets`, `balanceOf`) that accept a `ContractRunner` and return typed
promises. Pages never import ethers or the ABI directly — they call these
functions. `decodeContractError` centralises the mapping from ethers error codes
and custom error names to the strings in `en.json`, so error handling in every
page is a single `catch` block.

**Pages and components**

```
src/
├── config.ts
├── locales/en.json
├── theme.ts
├── context/
│   ├── useWallet.ts
│   └── WalletContext.tsx
├── utils/
│   └── contract.ts
├── components/
│   ├── Navbar/            — persistent nav bar with live wallet indicator
│   ├── WalletStatus/      — truncated address badge, copy on click
│   └── TxReceipt/         — transaction hash with Etherscan deep link
└── pages/
    ├── CreateWallet/      — multi-step wizard: generate mnemonic → verify words → encrypt keystore
    │   ├── PhraseStep/
    │   ├── VerifyStep/
    │   ├── PasswordStep/
    │   ├── CompleteStep/
    │   ├── KeystoreFileStep/
    │   └── KeystorePasswordStep/
    ├── BuyTicket/         — shows price, remaining supply, buy button
    ├── RedeemTicket/      — shows ticket balance, redeem button
    └── Balance/           — live ETH and ETK balances for connected wallet
```

Every component directory contains a `.tsx`, `.styles.ts`, `.test.tsx`, and
`.stories.tsx` file. Storybook stories cover all interactive states (hover, 
disabled, loading, error, success) using `storybook-addon-pseudo-states`
so reviewers can inspect every state without manual interaction. All stories are
checked against WCAG 2.1 AA by `addon-a11y`.

---

### Design Description

All user-facing strings live in `src/locales/en.json`. No text is hardcoded in JSX.
All configurable values (contract address, ticket price, max supply, chain ID, RPC
URL) come from environment variables read through `src/config.ts`.

---

#### Contract Deployment

> A successful deployment of the `EventTicket` contract.

**Transaction:** https://sepolia.etherscan.io/tx/0x735ffdba7458d83ff8e8ecc4f0574ba766ffaf1075f8ab0638da4142d3a894aa
**Contract address:** https://sepolia.etherscan.io/address/0x5fA9FfA6cCf23fF2162FC19bAE0334e491BF325C

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

## Environment Setup & Deploying the Contract

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your values — all fields are needed whether you are running the
app or deploying the contract:

```
VITE_CONTRACT_ADDRESS=0xYourContractAddressHere
VITE_MAX_SUPPLY=1000
VITE_TICKET_PRICE_WEI=10000000000000000
VITE_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
DEPLOY_PRIVATE_KEY=0xYourPrivateKeyHere
```

`VITE_MAX_SUPPLY` and `VITE_TICKET_PRICE_WEI` must match the values used when
the contract was deployed. The defaults (1000 tickets, 0.01 SETH) are pre-filled
in `.env.example`. `DEPLOY_PRIVATE_KEY` is only required when running
`npm run deploy` — export it from MetaMask → Account Details → Show Private Key.

To deploy the contract:

1. Ensure your deploying wallet holds SETH for gas fees (see MetaMask Setup above).
2. Run:

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

After buying a ticket the app displays the transaction hash with a direct link
to Sepolia Etherscan. To look up any transaction manually:

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
