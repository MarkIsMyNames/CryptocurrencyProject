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
   - Network name: Sepolia
   - RPC URL: https://rpc.sepolia.org
   - Chain ID: 11155111
   - Currency: ETH
4. Get test SETH from a faucet:
   - https://sepoliafaucet.com
   - https://faucet.quicknode.com/ethereum/sepolia

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

## Running the App

```bash
npm run dev
```

Open http://localhost:5173

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
- **Deployed via:** Remix IDE (https://remix.ethereum.org)

## Project Structure

See `docs/superpowers/specs/2026-04-27-eventticket-dapp-design.md` for full
architecture documentation.

## AI Declaration

All AI interactions are logged in `docs/ai/ai-log.md` with full four-step
traceability (prompt → critique → resolution → commit hash).
