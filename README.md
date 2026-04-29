# EventTicket DApp

Web3 ticketing system on Ethereum Sepolia Testnet. ERC-20 tickets (ETK) purchased
with SETH and burned on venue entry.

## Prerequisites

- Node.js 20+
- npm 10+
- MetaMask browser extension

## MetaMask Setup

1. Install MetaMask from https://metamask.io
2. Create or import a wallet
3. Add the Sepolia testnet:
   - Click the network dropdown → "Add a custom network"
   - Network name: Sepolia
   - RPC URL: https://ethereum-sepolia-rpc.publicnode.com
   - Chain ID: 11155111
   - Currency: ETH
4. Get test SETH from a faucet (no initial ETH required):
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
```

## Deploying the Contract

The app requires `EventTicket.sol` to be deployed on Sepolia before wallet connection will work.

1. Export your MetaMask private key: MetaMask → Account Details → Show Private Key
2. Add the following to your `.env`:

```
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
DEPLOY_PRIVATE_KEY=0xYourPrivateKeyHere
```

3. Run:

```bash
npm run deploy
```

This compiles the contract, deploys it to Sepolia from your wallet, and automatically updates `VITE_CONTRACT_ADDRESS` in your `.env`.

4. Restart the dev server so Vite picks up the new address:

```bash
npm run dev
```

> **Note:** The wallet must have SETH to cover gas fees before deploying. If you haven't already, get test SETH from a faucet (see MetaMask Setup above) and send it to your deploying address before running this command.

## Viewing Transactions

After buying a ticket the app displays the transaction ID and a link to view it on Etherscan. You can also look up any transaction manually:

1. Go to https://sepolia.etherscan.io
2. Paste the transaction ID (starting with `0x`) into the search bar
3. You will see the transaction status, gas used, block confirmation, and the ETK token transfer

## Running Tests

```bash
# Unit tests
npx vitest run

# Unit tests with coverage
npx vitest run --coverage

# Storybook (component explorer + a11y)
npm run storybook

# E2E tests (requires dev server running)
npx playwright test

# Lint
npm run lint

# Format check
npm run format:check
```

## Smart Contract

- **Network:** Ethereum Sepolia Testnet
- **Contract Address:** See `.env` / deployment docs
- **Deployed via:** Hardhat (`npm run deploy`)

## AI Declaration

All AI interactions are logged in `docs/ai/ai-log.md` with full four-step
traceability (prompt → critique → resolution → commit hash).
