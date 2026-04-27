# CLAUDE.md — EventTicket DApp

## Project Context
Blockchain Technologies and Applications — Block 8 submission.
Due: 2026-05-15. Web3 DApp on Ethereum Sepolia Testnet.
ERC-20 ticket tokens (ETK) purchasable with SETH, redeemable (burned) at door entry.

## Tech Stack
- React 19.2, Vite, TypeScript (strict mode — no `any`)
- styled-components v6 with ThemeProvider
- ethers.js v6
- React Router v6
- Vitest + React Testing Library (unit/component)
- Storybook 10 + addon-a11y + storybook-addon-pseudo-states
- Playwright (e2e)
- ESLint 10 (flat config, strictTypeChecked) + Prettier

## File & Folder Conventions
- Every component/page lives in its own directory containing:
  `ComponentName.tsx`, `ComponentName.styles.ts`, `ComponentName.test.tsx`, `ComponentName.stories.tsx`
- Styles use styled-components. Access theme via `${({ theme }) => theme.colors.*}`
- **NO raw colour values anywhere except `src/theme.ts`** — hex, rgb, hsl are banned in .styles.ts files (ESLint enforces this)
- All user-facing strings come from `src/locales/en.json` — no hardcoded text in JSX
- All configurable variables (contract address, chain ID, prices) come from `src/config.ts`
- Contract address is set via `VITE_CONTRACT_ADDRESS` environment variable in `.env`

## Code Style
- TypeScript strict + strictTypeChecked — no `any`, no unused variables, no floating promises
- No comments unless the WHY is non-obvious
- No multi-line docstrings
- Prettier enforced — run `npm run lint` and `npm run format:check` before committing

## Testing Requirements
- Every component must have a `.test.tsx` (Vitest + RTL)
- Every component must have a `.stories.tsx` with:
  - Default story
  - Stories for all interactive states (hover, focus, disabled, loading, error, success)
  - `@storybook/addon-a11y` — all stories must pass WCAG 2.1 AA
  - `storybook-addon-pseudo-states` for :hover/:focus/:active states
- E2E tests in `e2e/` using Playwright for full user flows

## AI Logging Requirement ⚠️
Every AI interaction MUST be logged in `docs/ai/ai-log.md` using this format:

```
## [YYYY-MM-DD] #NNN — Feature: Description

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** file or feature area

**Prompt (Step 1):**
[exact prompt text]

**Review critique (Step 2):**
[what was wrong, incomplete, or needed changing]

**Resolution (Step 3):**
[what was changed and why]

**Verdict:** Accepted / Modified / Rejected
**Commit hash (Step 4):** [hash]
```

Optimization passes must be separate entries tagged `[OPTIMIZATION]`.
Proactive prompts (specifying requirements upfront) score higher than reactive fixes.

## Smart Contract Rules
- OpenZeppelin v5 base contracts only (ERC20, Ownable, ReentrancyGuard)
- ReentrancyGuard on ALL functions that transfer ETH
- No magic numbers — reference config.ts or constructor parameters
- Custom errors (not require strings) for gas efficiency
- decimals() overridden to 0 so 1 ETK = 1 ticket

## Git & PR Conventions
- Commit format: `type(scope): description` (feat, fix, chore, test, docs)
- Branch naming: `feature/task-N-description`
- Never push directly to main — always open a PR via `gh pr create` and merge via `gh pr merge`
- No force pushes to main
- Every AI-generated commit must have a corresponding ai-log.md entry with commit hash
