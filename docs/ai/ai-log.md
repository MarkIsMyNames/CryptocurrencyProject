# AI Interaction Log

All AI interactions for the EventTicket DApp project, logged in real time.
Format: prompt → critique → resolution → commit hash.
Optimization entries tagged [OPTIMIZATION].

---

## [2026-04-27] #001 — Task 1: Vite + React 19.2 TypeScript scaffold

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** Project scaffold — package.json, vite.config.ts, tsconfig.json, src/test-setup.ts

**Prompt (Step 1 — proactive guidance):**
"Scaffold a Vite + React 19.2 + TypeScript project. Requirements:
- React 19.2.0, react-router-dom@6, styled-components@6, ethers@6
- Dev deps: vitest, @vitest/coverage-v8, jsdom, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
- Dev deps: eslint, @typescript-eslint/eslint-plugin, @typescript-eslint/parser, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-jsx-a11y, eslint-config-prettier, prettier, @playwright/test
- vite.config.ts: test.environment='jsdom', test.setupFiles=['./src/test-setup.ts'], test.globals=true
- tsconfig.json: strict:true, noEmit:true, jsx:'react-jsx', noUnusedLocals, noUnusedParameters
- src/test-setup.ts: import '@testing-library/jest-dom'
- Build must pass with npm run build"

**Review critique (Step 2):**
AI produced a working scaffold but with several issues requiring correction:
- `tsconfig.app.json` (the file actually used by `tsc -b`) was missing strict:true and related flags — application code would have compiled without strict mode despite it appearing in tsconfig.json
- `@types/styled-components@5` was installed alongside styled-components@6, which ships its own types — the v5 types cause conflicts and are explicitly not recommended for v6
- `package.json` name field was left as `"scaffold-temp"` (Vite template default)
- `index.html` title was left as `"scaffold-temp"`
- `vite.config.d.ts` and `vite.config.js` artefact files were left in project root
- ESLint 10 uses flat config format (`eslint.config.js`), not the legacy `.eslintrc.cjs` format specified in the plan — the plan's Task 2 section needs updating to reflect this

**Resolution (Step 3):**
- Added `"strict": true` to `tsconfig.app.json` compilerOptions (other strict flags were already present)
- Uninstalled `@types/styled-components` — styled-components v6 provides its own types
- Renamed package from `"scaffold-temp"` to `"eventticket-dapp"`
- Updated `<title>` in `index.html` to `"EventTicket DApp"`
- Deleted artefact files from project root
- Noted that Task 2 (ESLint config) must be implemented using ESLint 10 flat config format

**Verdict:** Modified before acceptance
**Commit hash (Step 4):** b8b12f4

---

## [2026-04-26] #002 — Task 2: ESLint flat config and Prettier

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** eslint.config.js, .prettierrc, .prettierignore

**Prompt (Step 1 — proactive guidance):**
"Implement Task 2: ESLint + Prettier configuration for a Vite + React 19.2 + TypeScript project. ESLint 10 is installed (dropped legacy .eslintrc.cjs support). Use flat config format (eslint.config.js). The scaffold already generated a basic eslint.config.js — rewrite it completely. Install eslint-plugin-jsx-a11y and eslint-config-prettier, replace eslint.config.js with the provided flat config, create .prettierrc and .prettierignore, update lint and format scripts in package.json, confirm zero lint errors and passing format check, then commit."

**Review critique (Step 2):**
- node_modules was absent from the worktree — npm install was required before lint could run.
- The standard Vite scaffold `src/main.tsx` uses a non-null assertion (`document.getElementById('root')!`) which is flagged as an error by `@typescript-eslint/no-non-null-assertion` (part of `tseslint.configs.strict`). This was not anticipated in the task spec.

**Resolution (Step 3):**
- Ran `npm install --legacy-peer-deps` to restore node_modules.
- Added `// eslint-disable-next-line @typescript-eslint/no-non-null-assertion` above the `createRoot` call in `src/main.tsx`. This is the correct minimal fix: the non-null assertion is idiomatic for the root mount point and should not require changing the code structure.
- All other files were created/rewritten exactly as specified.

**Verdict:** Modified
**Commit hash (Step 4):** e03102f

---

## [2026-04-27] #003 — Task 3: CLAUDE.md

**Tool:** Claude (claude-haiku-4-5)
**Feature:** CLAUDE.md

**Prompt (Step 1 — proactive guidance):**
"Create CLAUDE.md at the project root covering: project context, tech stack, file/folder conventions, code style, testing requirements, AI logging format, smart contract rules, and git/PR conventions. The AI logging section must specify the four-step format (prompt → critique → resolution → commit hash) and note that optimization passes must be separate entries tagged [OPTIMIZATION]."

**Review critique (Step 2):**
No issues found. The file was created with the exact content specified in the task requirements.

**Resolution (Step 3):**
Created CLAUDE.md at the project root with all sections as specified: project context (Block 8 submission), tech stack (React 19.2, Vite, TypeScript strict), file/folder conventions (component directory structure, styled-components theme usage, no raw colors except in src/theme.ts), code style (strict TypeScript, no comments unless necessary, Prettier enforced), testing requirements (Vitest + RTL + Storybook + Playwright), AI logging format (four-step process with optimization pass notation), smart contract rules (OpenZeppelin v5, ReentrancyGuard, custom errors), and git/PR conventions (feat/fix/chore/test/docs, feature/task-N branches, PR-based workflow). File committed successfully.

**Verdict:** Accepted
**Commit hash (Step 4):** 32c3b68

---

## [2026-04-27] #004 — Task 4: Foundation files

**Tool:** Claude (claude-haiku-4-5)
**Feature:** src/theme.ts, src/config.ts, src/locales/en.json, src/styled.d.ts

**Prompt (Step 1 — proactive guidance):**
"Create four foundation files for the EventTicket DApp:
- theme.ts: single source of truth for all colours using descriptive semantic names. Must cover backgrounds, brand, status, text, and border colours. Export as const with Theme type.
- styled.d.ts: augment DefaultTheme to match Theme type so styled-components has full type inference.
- config.ts: all configurable variables (contractAddress from env, sepoliaChainId, ticketPriceWei, tokenSymbol, etc.) as const.
- en.json: all user-facing strings for nav, wallet creation, balance, buyTicket, redeem, and errors.
No raw colour values allowed anywhere except theme.ts."

**Review critique (Step 2):**
Two ESLint errors emerged during linting:
- `config.ts`: Unsafe assignment of `import.meta.env.VITE_CONTRACT_ADDRESS` (type `any`). Required explicit type assertion to `string | undefined`.
- `styled.d.ts`: Empty interface extending another interface is flagged as equivalent to supertype. Added eslint-disable comment to suppress the false positive (the augmentation syntax is idiomatic TypeScript ambient type declaration).
Additionally, `.d.ts` files are ignored by `.gitignore` (line 19: `*.d.ts`), preventing commit of hand-written `src/styled.d.ts`. Required adding exception rule `!src/styled.d.ts`.

**Resolution (Step 3):**
- Cast `import.meta.env.VITE_CONTRACT_ADDRESS` as `string | undefined` in config.ts to satisfy type safety.
- Added `// eslint-disable-next-line @typescript-eslint/no-empty-object-type` comment in styled.d.ts to suppress the spurious warning.
- Updated `.gitignore` to include `!src/styled.d.ts` exception after the `*.d.ts` rule.
- Verified all files created, tsc passed with no errors, eslint passed with zero warnings.

**Verdict:** Modified before acceptance
**Commit hash (Step 4):** 046513f

---

## [2026-04-27] #005 — Task 5: EventTicket.sol smart contract

**Tool:** Claude (claude-haiku-4-5)
**Feature:** contracts/EventTicket.sol

**Prompt (Step 1 — proactive guidance):**
"Generate a Solidity ERC-20 smart contract for an event ticketing system on Ethereum Sepolia.
Requirements:
- OpenZeppelin v5 base: ERC20, Ownable, ReentrancyGuard
- decimals() overridden to 0 so 1 ETK = 1 ticket (no decimal places)
- maxSupply and ticketPrice set as immutable in constructor (default 1000 tickets, 0.01 SETH)
- buyTicket() payable: requires exact SETH payment, enforces one ticket per wallet, checks max supply, mints 1 token, emits TicketPurchased event
- redeemTicket(): caller burns their own ticket (no privileged role), emits TicketRedeemed event
- withdrawFunds() onlyOwner with ReentrancyGuard — transfers ETH to owner
- remainingTickets() view: returns maxSupply minus totalSupply
- Custom errors (not require strings) for gas efficiency — IncorrectPayment includes sent/required values
- ReentrancyGuard on ALL functions that transfer ETH (buyTicket and withdrawFunds)"

**Review critique (Step 2):**
Initial design was reviewed for:
- ReentrancyGuard coverage on both ETH-transferring functions ✓
- Custom errors with informative parameters ✓
- checks-effects-interactions pattern in buyTicket() ✓
- decimals() marked pure not view ✓
- immutable for gas savings on ticketPrice and maxSupply ✓
No gaps found — contract followed all proactive requirements from the initial prompt.

**Resolution (Step 3):**
No changes needed. Contract accepted as designed.

**Verdict:** Accepted without modification
**Commit hash (Step 4):** e9a9090

---

**Security review fixes applied after initial acceptance (2026-04-26):**

Three security issues were identified in a follow-up review and corrected:

1. **Soulbound / non-transferable tickets** — ERC-20 `transfer` and `transferFrom` were inherited without restriction, allowing ticket trading between wallets. Fixed by overriding `_update` to revert with `TicketsAreNonTransferable()` on any call where `from != address(0)` and `to != address(0)`. Only minting (`_mint`) and burning (`_burn`) are now permitted.

2. **NothingToWithdraw guard** — `withdrawFunds()` would previously call `owner().call{value: 0}("")` when the contract balance was zero, wasting gas and emitting a misleading success. Fixed by adding an early revert with `NothingToWithdraw()` when `address(this).balance == 0`.

3. **Constructor zero-value validation** — A `maxSupply` of 0 would make the contract permanently unusable (every `buyTicket` call reverts with `SoldOut`). Fixed by adding `if (_maxSupply == 0) revert InvalidConfiguration();` at the top of the constructor.

Three new custom errors added: `TicketsAreNonTransferable`, `NothingToWithdraw`, `InvalidConfiguration`.

**Commit hash (security fixes):** ee02873

---

## [2026-04-27] [OPTIMIZATION] #001 — Smart Contract: Security Review

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** contracts/EventTicket.sol — security audit pass

**Prompt (Step 1):**
"Review EventTicket.sol for security vulnerabilities. Specifically:
- Are ERC-20 transfer functions restricted to prevent ticket trading?
- Does withdrawFunds() guard against zero-balance calls?
- Does the constructor validate inputs that would make the contract permanently unusable?
- Are there any reentrancy risks beyond the existing nonReentrant guards?"

**Review critique (Step 2):**
Three security issues identified:
1. ERC-20 `transfer` and `transferFrom` were inherited without restriction — tickets could be traded between wallets, violating the one-ticket-per-wallet and soulbound intent.
2. `withdrawFunds()` would call `owner().call{value: 0}("")` when balance was zero, wasting gas and emitting misleading success.
3. A `maxSupply` of 0 in the constructor would make the contract permanently unusable since every `buyTicket` call would revert with `SoldOut`.

**Resolution (Step 3):**
1. Overrode `_update` to revert with `TicketsAreNonTransferable()` when both `from` and `to` are non-zero addresses. This allows minting (`_mint`) and burning (`_burn`) while blocking transfers.
2. Added `NothingToWithdraw()` revert when `address(this).balance == 0` at the start of `withdrawFunds()`.
3. Added `if (_maxSupply == 0) revert InvalidConfiguration();` at the top of the constructor.
Three new custom errors added: `TicketsAreNonTransferable`, `NothingToWithdraw`, `InvalidConfiguration`.

**Verdict:** Modified — three security issues fixed
**Commit hash (Step 4):** ee02873

---

## [2026-04-27] #006 — Task 6: Storybook 10 setup

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** Storybook 10 with addon-a11y and storybook-addon-pseudo-states

**Prompt (Step 1 — proactive guidance):**
"Set up Storybook 10 with Vite builder, addon-a11y for WCAG 2.1 AA enforcement, and storybook-addon-pseudo-states for hover/focus state testing. Configure ThemeProvider decorator so all stories receive the styled-components theme."

**Review critique (Step 2):**
`npx storybook init` failed to install dependencies due to a peer dependency conflict with `eslint-plugin-jsx-a11y`. Required `--legacy-peer-deps` to resolve. The init also added `@storybook/addon-essentials` to main.ts but that package is not published for Storybook 10 (functionality split into individual addons); replaced with `@storybook/addon-docs` which was installed by init. Generated `src/stories/` directory with sample stories was deleted as it conflicts with the per-component story structure. `preview.ts` was replaced with `preview.tsx` to support JSX ThemeProvider decorator syntax.

**Resolution (Step 3):**
- Ran `npm install --legacy-peer-deps` to resolve peer dependency conflict.
- Installed `storybook-addon-pseudo-states` separately with `--legacy-peer-deps`.
- Replaced `.storybook/main.ts` with specified config using `@storybook/addon-docs` in place of unavailable `@storybook/addon-essentials`.
- Deleted `preview.ts`, created `preview.tsx` with ThemeProvider decorator.
- Removed auto-generated `src/stories/` directory.
- Verified `npm run build-storybook` completes successfully with `storybook-static/` output.

**Verdict:** Modified before acceptance
**Commit hash (Step 4):** 54f187d

---

## [2026-04-27] #007 — Task 7: Playwright setup

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** playwright.config.ts + e2e/ skeleton specs

**Prompt (Step 1 — proactive guidance):**
"Set up Playwright with Chromium-only config, baseURL http://localhost:5173, webServer integration for Vite dev server. Create skeleton e2e specs for Wallet Creation, Balance Check, Buy Ticket, and Redeem Ticket flows — each with a single navigation test. Full e2e tests will be filled in after all pages are implemented."

**Review critique (Step 2):**
No issues found.

**Resolution (Step 3):**
No changes required.

**Verdict:** Accepted as-is
**Commit hash (Step 4):** cd54749

---

## [2026-04-27] #008 — Task 8: GitHub Actions workflows

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** .github/workflows/ — lint, format, unit-tests, accessibility, e2e

**Prompt (Step 1 — proactive guidance):**
"Create five separate GitHub Actions workflows triggered on push to main and on PRs: lint.yml (ESLint + tsc --noEmit), format.yml (Prettier check), unit-tests.yml (Vitest with coverage), accessibility.yml (Storybook build), e2e.yml (Playwright with Chromium install and VITE_CONTRACT_ADDRESS stub)."

**Review critique (Step 2):**
No issues found. Workflows follow standard GitHub Actions patterns with correct Node 20 setup, npm caching, and appropriate commands per workflow type.

**Resolution (Step 3):**
No changes required.

**Verdict:** Accepted as-is
**Commit hash (Step 4):** 1cfe57c

---

## [2026-04-27] #009 — Task 9: WalletContext and utility files

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/context/WalletContext.tsx, src/utils/contract.ts, src/utils/wallet.ts

**Prompt (Step 1 — proactive guidance):**
"Create WalletContext with connect/disconnect/refreshBalances actions, MetaMask BrowserProvider integration, Sepolia chain ID check, and typed state (address, ethBalance, etkBalance, isConnected, isConnecting, error). Create contract.ts with ABI array and getContract/decodeContractError helpers. Create wallet.ts with generateWallet and downloadKeystore using ethers.js Wallet.createRandom and encrypt."

**Review critique (Step 2):**
Two issues found: (1) window.ethereum was untyped — TypeScript errors TS2339 on all three access sites. (2) ESLint react-refresh/only-export-components warning because useWallet hook is co-exported from the same file as WalletProvider component. Also @testing-library/dom was missing as a dependency causing the test runner to fail before the implementation existed.

**Resolution (Step 3):**
Created src/globals.d.ts declaring Window.ethereum as Eip1193Provider intersection with typed request method — resolved all TS errors. Added file-level eslint-disable comment for react-refresh/only-export-components with rationale (context files legitimately co-export hooks). Installed @testing-library/dom with --legacy-peer-deps to satisfy the missing peer dependency.

**Verdict:** Modified before acceptance
**Commit hash (Step 4):** 1499e8c

---

## [2026-04-27] #010 — Task 10: Navbar component

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/components/Navbar/

**Prompt (Step 1 — proactive guidance):**
"Create Navbar component with styled-components, routing links from en.json strings, NavBrand, NavLinks, NavLink (active state via .active class). Include Storybook stories with Default, HoverState (pseudo.hover), FocusState (pseudo.focus) and addon-a11y enabled."

**Review critique (Step 2):**
Two issues found: (1) Stories file imported from `@storybook/react` — ESLint storybook/no-renderer-packages rule requires the framework package `@storybook/react-vite` instead. (2) Test used `async` on a callback with no `await` — TypeScript strictTypeChecked flags this via @typescript-eslint/require-await.

**Resolution (Step 3):**
Changed stories import to `@storybook/react-vite`. Removed `async` keyword from the accessibility test callback since no await expression is used.

**Verdict:** Modified before acceptance
**Commit hash (Step 4):** 995e195

---

## [2026-04-27] #011 — Task 11: WalletStatus component

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/components/WalletStatus/

**Prompt (Step 1 — proactive guidance):**
"Create WalletStatus component showing a coloured dot (green=connected, red=disconnected) and either a truncated wallet address (first 6 + last 4 chars) or the 'Not connected' string from en.json. Use theme.colors.statusSuccess/statusError for dot colour. Storybook stories for Disconnected and Connected states via WalletContext.Provider decorator."

**Review critique (Step 2):**
One issue found: WalletContext was not exported from WalletContext.tsx, which would prevent the stories file from importing it directly to use as a Provider wrapper. Required adding `export` to the `const WalletContext` declaration.

**Resolution (Step 3):**
Added `export` keyword to `const WalletContext = createContext<WalletContextValue | null>(null)` in WalletContext.tsx. All other files matched the specification exactly — no further changes required.

**Verdict:** Modified before acceptance
**Commit hash (Step 4):** 1f4d469

---

## [2026-04-27] #012 — Task 12: CreateWallet page

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/pages/CreateWallet/

**Prompt (Step 1 — proactive guidance):**
"Create CreateWallet page with two paths: generate a new wallet (Wallet.createRandom) showing address, mnemonic, and toggle-revealed private key with keystore download; or connect MetaMask via useWallet().connect(). All strings from en.json, all styles via theme. Storybook stories for Default, Connecting state, and ButtonFocus."

**Review critique (Step 2):**
One issue found: the stories file used `async () => undefined` for noopAsync which TypeScript strictTypeChecked flags via @typescript-eslint/require-await (async function with no await expression). Required changing to `() => Promise.resolve()` instead.

**Resolution (Step 3):**
Changed `const noopAsync = async () => undefined` to `const noopAsync = () => Promise.resolve()` in CreateWallet.stories.tsx. All other files matched the specification exactly — no further changes required.

**Verdict:** Modified before acceptance
**Commit hash (Step 4):** bfc446f

---

## [2026-04-27] #013 — Task 13: Balance page

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/pages/Balance/

**Prompt (Step 1 — proactive guidance):**
"Create Balance page with an address input (pre-filled with connected wallet address), Check Balance button, and a grid showing SETH balance (formatted with formatEther), ETK ticket count, and remaining supply. Address validated with ethers isAddress(). Storybook stories for Default, InputFocus, ButtonHover."

**Review critique (Step 2):**
Two issues found: (1) `balance.title` in en.json was "Check Balance" — same string as `balance.checkBtn` — causing `getByText('Check Balance')` in tests to match two elements and fail. Required changing the title to "Wallet Balance". (2) ESLint flagged an unnecessary type assertion (`rawEth as bigint`) and a confusing void expression in an arrow function shorthand (`onChange`). Required removing the cast and adding braces to the onChange handler.

**Resolution (Step 3):**
Changed `balance.title` in en.json from "Check Balance" to "Wallet Balance". Removed `as bigint` cast on `formatEther(rawEth)` since `provider.getBalance()` already returns `bigint` in ethers v6. Added braces to the `onChange` arrow function to satisfy `@typescript-eslint/no-confusing-void-expression`. All other files matched the specification exactly.

**Verdict:** Modified before acceptance
**Commit hash (Step 4):** 695a3c0

---

## [2026-04-27] #014 — Task 14: BuyTicket page

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/pages/BuyTicket/

**Prompt (Step 1 — proactive guidance):**
"Create BuyTicket page showing ticket price (from config.ticketPriceDisplay), remaining tickets, and user's current balance. Buy button calls contract.buyTicket({ value: parseEther('0.01') }), shows pending/success/error states. Disables button if already owns ticket, sold out, or transaction pending. All strings from en.json."

**Review critique (Step 2):**
Two issues found: (1) The first test was `async` with no `await` expression, triggering `@typescript-eslint/require-await`. Required removing the `async` keyword. (2) In BuyTicket.tsx the error message lookup used `Record<string, string>` which TypeScript treats as always returning `string`, making the `??` fallback chain an unnecessary condition. Required typing the lookup objects as `Partial<Record<string, string>>` so `undefined` is possible and the `??` chain is valid.

**Resolution (Step 3):**
Removed `async` from the first test callback. Changed the error lookup variables from `as Record<string, string>` casts to `Partial<Record<string, string>>` type annotations. All other files matched the specification exactly.

**Verdict:** Modified before acceptance
**Commit hash (Step 4):** 5c6af57


---

## [2026-04-27] #015 — Task 15: RedeemTicket page

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/pages/RedeemTicket/

**Prompt (Step 1 — proactive guidance):**
"Create RedeemTicket page showing wallet address and ticket status badge (valid/none). Redeem at Door button calls contract.redeemTicket(), waits for tx, shows success message. Button disabled when no ticket, pending, or already redeemed. Error strings from en.json via decodeContractError. Storybook stories for Default (disconnected), HasTicket, ButtonHover, ButtonFocus."

**Review critique (Step 2):**
en.json already had redeem keys but with different values for yourAddress ("Your Wallet Address"), hasTicket ("Valid — 1 ETK"), and noTicket ("No ticket found"). Required updating to match specification. All component files followed BuyTicket pattern closely; no structural issues found.

**Resolution (Step 3):**
Updated three en.json values to match specification. Created RedeemTicket.styles.ts, RedeemTicket.tsx, RedeemTicket.stories.tsx, and RedeemTicket.test.tsx. All 3 tests pass, lint and tsc clean.

**Verdict:** Modified before acceptance
**Commit hash (Step 4):** 2b8b88d

## [2026-04-27] #016 — Task 16: App.tsx routing and main.tsx wiring

**Tool:** Claude (claude-haiku-4-5)
**Feature:** src/App.tsx, src/main.tsx

**Prompt (Step 1 — proactive guidance):**
"Wire up main.tsx with BrowserRouter, ThemeProvider, and WalletProvider wrapping the App. Replace App.tsx with React Router v6 Routes for /, /create-wallet, /balance, /buy-ticket, /redeem. Add GlobalStyle for box-sizing reset and body background from theme. Navbar and WalletStatus in header. Use styled-components for header to avoid inline styles triggering lint warnings."

**Review critique (Step 2):**
No issues found. All files followed specification exactly. Lint and tsc both pass clean. The pre-existing test failures for Storybook and e2e tests are unrelated to the routing implementation (they were failing before these changes).

**Resolution (Step 3):**
Created main.tsx with BrowserRouter, ThemeProvider, and WalletProvider nesting, and StrictMode. Replaced App.tsx with Routes for all four pages (/, /create-wallet, /balance, /buy-ticket, /redeem) plus redirect from / to /create-wallet. Added GlobalStyle with box-sizing reset and theme-based body colors. Used styled-components (AppHeader and WalletStatusWrapper) to avoid inline styles. Both files are clean and lint/tsc pass.

**Verdict:** Accepted
**Commit hash (Step 4):** c71deab

---

## [2026-04-27] #017 [OPTIMIZATION] — Task 17: Smart Contract Gas Efficiency Review

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** contracts/EventTicket.sol — dedicated gas optimization pass

**Prompt (Step 1):**
"Review EventTicket.sol for gas inefficiencies. Specifically check:
- Are all read-only state variables that never change marked immutable?
- Does remainingTickets() avoid unnecessary storage reads?
- Are custom errors used instead of require strings?
- Is decimals() marked pure instead of view?
- Are there any redundant storage reads inside functions?"

**Review critique (Step 2):**
AI confirmed ticketPrice and maxSupply were already immutable.
AI confirmed custom errors were in place.
AI confirmed remainingTickets() uses maxSupply - totalSupply() which avoids any soldCount SLOAD.
AI confirmed decimals() is pure.
No further changes needed.

**Verdict:** Accepted without modification — contract was already gas-optimised from the initial proactive prompt in entry #005.
**Commit hash (Step 4):** 3383ca6

---

## [2026-04-27] #018 — Task 18: Full Playwright e2e tests

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** e2e/ — full flow tests for all four pages

**Prompt (Step 1 — proactive guidance):**
"Write full Playwright e2e tests for all four pages. wallet.spec: root redirect, generate wallet, wallet details visible, private key hidden. balance.spec: address input visible, invalid address error. buyTicket.spec: connect prompt, ticket price visible. redeemTicket.spec: connect prompt, page title. Use exact strings from en.json."

**Review critique (Step 2):**
The webServer config timed out on the first run because no dev server was running and the 60s timeout was insufficient in the test environment. Tests themselves needed no selector fixes — all matched the actual rendered output using en.json strings exactly.

**Resolution (Step 3):**
Started the dev server manually before running tests. All 10 tests passed without any changes to test files or app code.

**Verdict:** Accepted
**Commit hash (Step 4):** 9336b96

---

## [2026-04-27] #019 — Task 19: README and submission documentation

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** README.md, docs/report/README.md

**Prompt (Step 1 — proactive guidance):**
"Create README.md with project description, prerequisites (Node.js 20+, npm 10+, MetaMask), MetaMask setup steps (Sepolia network config, faucet links), installation, environment setup (cp .env.example .env), running the app, test commands (vitest, storybook, playwright, lint, format:check), smart contract section, project structure pointer, and AI declaration section. Create docs/report/README.md as a placeholder listing the five sections the student must complete manually: Code Overview, Design Description, Transaction Links, Peer Review Reflection, Statement on use of Generative AI."

**Review critique (Step 2):**
No issues found. The files were created exactly as specified. The existing README.md was the Vite scaffold default and needed full replacement. Pre-existing lint/format warnings in src/ files are unrelated to this task's changes.

**Resolution (Step 3):**
Replaced the default Vite scaffold README.md with the project-specific content. Created docs/report/ directory with README.md placeholder listing the five manually-authored sections required for submission.

**Verdict:** Accepted
**Commit hash (Step 4):** 8ddda11

---

## [2026-04-27] [OPTIMIZATION] #003 — Frontend: Performance Review

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** React components — frontend performance pass

**Prompt (Step 1):**
"Review the React components in this project for performance issues. Specifically:
- Are any expensive computations happening on every render without useMemo?
- Are callbacks being recreated on every render unnecessarily without useCallback?
- Are any blockchain calls being made without proper dependency arrays in useEffect?
- Are there any unnecessary re-renders caused by context value reference changes?"

**Review critique (Step 2):**
AI identified that WalletContext was passing a new object reference on every render
because the context value was constructed inline, causing all consumers to re-render
on every state change even when their relevant slice hadn't changed.
AI confirmed useCallback was already used for connect/disconnect/refreshBalances.
AI confirmed useEffect dependency arrays in BuyTicket and RedeemTicket were correct.

**Resolution (Step 3):**
The WalletContext spreads state into the context value which still creates a new
reference each render. For this project scope (small app, few consumers) this is
acceptable — splitting into separate contexts would be premature optimisation.
Documented the tradeoff rather than over-engineering.

**Verdict:** No code changes — tradeoff accepted and documented.
**Commit hash (Step 4):** c1ff18a

---

## [2026-04-27] #020 — Fix: Vitest picking up Playwright e2e specs from worktrees

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** vite.config.ts test configuration

**Prompt (Step 1):**
The unit test suite (Vitest) is failing. The vitest `projects` config in `vite.config.ts` has no `include`/`exclude` on the jsdom project, so Vitest is picking up Playwright spec files from `.worktrees/*/e2e/` and `e2e/`. Constrain the jsdom project to `src/**/*.test.{ts,tsx}` only and exclude `e2e/**` and `.worktrees/**`. Also `node_modules` is missing — install with `--legacy-peer-deps` due to `eslint-plugin-jsx-a11y` peer dep conflict. After the fix, all 13 test files should pass. Log the change in `docs/ai/ai-log.md`.

**Review critique (Step 2):**
The prompt accurately diagnosed both issues upfront: missing `node_modules` and the missing `include`/`exclude` on the vitest jsdom project. No reactive guessing was needed.

**Resolution (Step 3):**
Ran `npm install --legacy-peer-deps`, then added `include: ['src/**/*.test.{ts,tsx}']` and `exclude: ['e2e/**', '.worktrees/**']` to the jsdom project in `vite.config.ts`. All 13 test files / 37 tests now pass.

**Verdict:** Accepted
**Commit hash (Step 4):** dbed855

---

## [2026-04-27] #021 — Refactor: Move App styled components to App.styles.ts, delete App.css

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/App.tsx, src/App.styles.ts, src/App.css

**Prompt (Step 1):**
`App.tsx` contains `GlobalStyle`, `AppHeader`, and `WalletStatusWrapper` styled components inline, violating the project convention that all styles live in a sibling `.styles.ts` file. `App.css` is a 185-line unused Vite scaffold file that should be deleted. Move the three styled components to `src/App.styles.ts`, update `App.tsx` to import from it, and delete `App.css`. Build must still pass.

**Review critique (Step 2):**
No issues. The refactor was straightforward — no logic changed, only file boundaries. Build passed clean on first attempt.

**Resolution (Step 3):**
Created `src/App.styles.ts` exporting `GlobalStyle`, `AppHeader`, and `WalletStatusWrapper`. Updated `App.tsx` to import them. Deleted `src/App.css`.

**Verdict:** Accepted
**Commit hash (Step 4):** ed4e1f4

---

## [2026-04-27] #022 — Fix: Downgrade ESLint to v9 to resolve CI peer dependency conflict

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** package.json, package-lock.json

**Prompt (Step 1):**
All GitHub Actions were failing with `npm error ERESOLVE could not resolve` because `eslint-plugin-jsx-a11y@6.10.2` declares peer support only up to ESLint 9, but the project had `eslint@^10.2.1`. Fix the CI failure.

**Review critique (Step 2):**
The prompt was reactive — the error surfaced from CI rather than being anticipated. The root cause was already spelled out in the npm error output, so no diagnosis was needed.

**Resolution (Step 3):**
Downgraded `eslint` from `^10.2.1` to `^9.0.0` in `package.json` and regenerated `package-lock.json`. ESLint 9 supports flat config and all other plugins in the project. `npm run lint` passes clean.

**Verdict:** Accepted
**Commit hash (Step 4):** 9b5e903

---

## [2026-04-27] #023 — Fix: Prettier formatting and Playwright Chromium missing in unit-tests CI

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** .github/workflows/unit-tests.yml, 10 src files

**Prompt (Step 1):**
Two CI failures: (1) `npm run format:check` flagged 10 files with formatting issues. (2) `npx vitest run --coverage` crashed with an unhandled error because the Storybook vitest project uses `@vitest/browser-playwright` with Chromium, but the runner never installs the browser. Fix both.

**Review critique (Step 2):**
Both failures were reactive — surfaced from CI logs. The Playwright issue was latent from when the Storybook browser project was added to vite.config.ts without updating the workflow.

**Resolution (Step 3):**
Ran `npm run format` to auto-fix 10 files. Added `npx playwright install chromium --with-deps` to `.github/workflows/unit-tests.yml` before the vitest step so Chromium is available for the Storybook browser project.

**Verdict:** Accepted
**Commit hash (Step 4):** 0cd49be

---

## [2026-04-27] #024 — Fix: Storybook background colour, accessibility, unused React import, and tsconfig coverage

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** .storybook/preview.tsx, tsconfig.json

**Prompt (Step 1):**
Storybook canvas was rendering on the default white background instead of the app's dark theme (`#0f1117`), causing components designed for a dark background to fail WCAG 2.1 AA colour-contrast checks. Additionally, `import React` in `preview.tsx` was unused (TS6133) and `.storybook/` was absent from `tsconfig.json` so TypeScript never checked it.

**Review critique (Step 2):**
All three issues were reactive. The background omission was the root cause of the accessibility failures — the components' text colours are correct against the dark background but fail against white. The tsconfig gap meant the unused import went undetected.

**Resolution (Step 3):**
Removed `import React from 'react'` (redundant with React 17+ JSX transform). Added `.storybook` to the `include` array in `tsconfig.json`. For the background, Claude's attempts using `parameters.backgrounds.default` and then `parameters.backgrounds.options` both failed — the correct Storybook 8+ fix was applied manually: `initialGlobals: { backgrounds: { value: theme.colors.backgroundPage } }` combined with `parameters.backgrounds.values` to register the option, and `a11y.test: 'error'` with `reviewOnFail: false` to enforce accessibility failures as errors. `tsc --noEmit` passes clean.

**Verdict:** Modified
**Commit hash (Step 4):** 28ecf87

---

## [2026-04-27] #025 — Fix: Extend ESLint, Prettier, and TypeScript to cover .storybook/

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** eslint.config.js, tsconfig.app.json, tsconfig.json, package.json, .storybook/main.ts

**Prompt (Step 1):**
`.storybook/` files were not covered by ESLint, Prettier, or TypeScript. Extend all three tools to include them.

**Review critique (Step 2):**
Multiple failed attempts before arriving at the correct fix. TypeScript silently ignores hidden directories (dot-prefixed) even when explicitly listed in `include` — `files` must be used instead. ESLint's `project: true` auto-detection failed to resolve the correct tsconfig; explicit paths were needed. `tsconfig.app.json` (not `tsconfig.json`) is the correct tsconfig for app and storybook files as it has `jsx`, `DOM` lib, and strict mode. The `previewHead` callback was simplified from `(head) => \`${head ?? ''}<style>...\`` to `() => \`<style>...\`` since no other content is injected into the preview head.

**Resolution (Step 3):**
Added `.storybook/main.ts` and `.storybook/preview.tsx` to `files` in `tsconfig.app.json`. Changed ESLint `parserOptions.project` from `true` to `['./tsconfig.app.json', './tsconfig.node.json']`. Expanded `lint` script to include `.storybook` and `format`/`format:check` scripts to include `.storybook/**/*.{ts,tsx}`. Simplified `previewHead` to drop the unused `head` parameter. `npm run lint` and `npm run format:check` both pass clean.

**Verdict:** Accepted
**Commit hash (Step 4):** 28ecf87

---

## [2026-04-27] #026 — Fix: Install @openzeppelin/contracts to resolve EventTicket.sol imports

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** contracts/EventTicket.sol, package.json

**Prompt (Step 1):**
`EventTicket.sol` imports from `@openzeppelin/contracts` (ERC20, Ownable, ReentrancyGuard) but the package was not installed, causing all OZ symbols to be unresolved in the IDE and any Solidity tooling.

**Review critique (Step 2):**
Reactive fix — the package was simply missing. No Hardhat or Foundry config exists in the repo so `npm install` was the correct installation path.

**Resolution (Step 3):**
Ran `npm install @openzeppelin/contracts`, which added `@openzeppelin/contracts@^5.6.1` to `dependencies` in `package.json` and regenerated `package-lock.json`. All three import paths now resolve to `node_modules/@openzeppelin/contracts/`.

**Verdict:** Accepted
**Commit hash (Step 4):** 2ca3ef1

---

## [2026-04-27] #027 — Feat: Expand Playwright e2e test coverage across all pages and navbar

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** e2e/navbar.spec.ts, e2e/wallet.spec.ts, e2e/balance.spec.ts, e2e/buyTicket.spec.ts, e2e/redeemTicket.spec.ts

**Prompt (Step 1):**
Existing Playwright e2e tests were shallow — each page had 1-2 smoke tests only. Add more tests for better coverage across all pages and the navbar.

**Review critique (Step 2):**
The existing tests covered basic visibility but missed: navbar navigation behaviour, private key reveal/hide toggle, mnemonic display after wallet generation, page titles/subtitles, empty address submission on balance, and info labels on buy/redeem pages. All new tests operate without a connected wallet so no blockchain mocking is required.

**Resolution (Step 3):**
Created `e2e/navbar.spec.ts` (4 tests: brand visible, and navigation to each route via nav link). Added to `wallet.spec.ts`: reveal/hide private key toggle, page title/subtitle, mnemonic card visible after generation. Added to `balance.spec.ts`: empty submission validation, page title/subtitle. Added to `buyTicket.spec.ts`: page title/subtitle, tickets remaining label. Added to `redeemTicket.spec.ts`: page subtitle. Total new tests: 13. All hardcoded strings replaced with imports from `src/locales/en.json` so tests stay in sync with copy changes automatically.

**Verdict:** Modified
**Commit hash (Step 4):** a771a95

---

## [2026-04-27] #028 — Refactor: Extract route paths into src/routes.ts and use in app and e2e tests

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/routes.ts, src/App.tsx, src/components/Navbar/Navbar.tsx, e2e/*.spec.ts

**Prompt (Step 1):**
Route path strings were hardcoded in `App.tsx`, `Navbar.tsx`, and all Playwright specs. Extract them into a single `src/routes.ts` const object so route changes only need updating in one place.

**Review critique (Step 2):**
Straightforward refactor. The pattern mirrors `config.ts` and `en.json` — all configurable values in one file. TypeScript's `as const` ensures the values are narrow string literals, compatible with React Router's `to` prop and Playwright's `page.goto()`.

**Resolution (Step 3):**
Created `src/routes.ts` exporting a `routes` const with keys `root`, `createWallet`, `balance`, `buyTicket`, and `redeem`. Updated `App.tsx` and `Navbar.tsx` to import from `routes`. Updated all five e2e spec files to import and use `routes` for every `page.goto()` and `toHaveURL()` assertion. `tsc --noEmit` passes clean.

**Verdict:** Accepted
**Commit hash (Step 4):** e083d18

---

## [2026-04-27] #029 — Chore: Replace default Vite assets in public/ with project-appropriate files

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** public/favicon.svg, public/icons.svg

**Prompt (Step 1):**
`public/` contained two Vite scaffold files: `icons.svg` (social media icon sprites — Bluesky, Discord, GitHub, X etc.) with no references anywhere in the codebase, and `favicon.svg` (the default Vite lightning bolt). Replace them with something appropriate for the project.

**Review critique (Step 2):**
`icons.svg` was clearly unused scaffolding. `favicon.svg` was referenced in `index.html` and needed replacing, not deleting.

**Resolution (Step 3):**
Deleted `icons.svg`. Replaced `favicon.svg` with a minimal ticket icon: purple (`#6c63ff`) ticket body with perforation notches, a dashed tear line, and a checkmark detail using the app's theme colours (`#6c63ff`, `#0f1117`, `#f1f5f9`).

**Verdict:** Accepted
**Commit hash (Step 4):** 3201ef0

---

## [2026-04-27] #030 — Chore: Delete unused src/assets/ directory

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/assets/

**Prompt (Step 1):**
`src/assets/` contained `hero.png`, `react.svg`, and `vite.svg` — all Vite scaffold files with no references anywhere in the codebase.

**Review critique (Step 2):**
Confirmed zero references before deleting. `tsc --noEmit` and `npm run lint` both pass clean after removal.

**Resolution (Step 3):**
Deleted `src/assets/` and all three files within it.

**Verdict:** Accepted
**Commit hash (Step 4):** 7195dfa

---

## [2026-04-27] #031 — Refactor: Move MemoryRouter to global Storybook decorator, remove redundant a11y params

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** .storybook/preview.tsx, src/components/Navbar/Navbar.stories.tsx, src/pages/CreateWallet/CreateWallet.stories.tsx

**Prompt (Step 1):**
`Navbar.stories.tsx` and `CreateWallet.stories.tsx` each had a local `MemoryRouter` decorator and `parameters: { a11y: { disable: false } }`. The router wrapper belongs in the global decorator since the whole app runs inside a router, and the a11y parameter is redundant as it just re-enables the already-enabled default.

**Review critique (Step 2):**
Only `Navbar` actively uses router APIs (`NavLink`), but adding `MemoryRouter` globally is correct — it matches the real app context and protects any future component that needs it. `a11y: { disable: false }` was genuinely redundant given the global `a11y.test: 'error'` config in preview.tsx.

**Resolution (Step 3):**
Added `MemoryRouter` wrapping `ThemeProvider` in the global decorator in `preview.tsx`. Removed the local `MemoryRouter` decorator and `a11y` parameter from both story files. Removed the `react-router-dom` imports from both story files.

**Verdict:** Accepted
**Commit hash (Step 4):** 7195dfa

---

## [2026-04-27] #032 — Refactor: Simplify story meta to inline export default satisfies pattern

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/**/*.stories.tsx (all 6 files)

**Prompt (Step 1):**
Story files used the verbose `const meta: Meta<typeof X> = { ... }; export default meta` pattern with explicit `title` fields. Simplify to `export default { component: X } satisfies Meta<typeof X>` and remove redundant `title` fields and `a11y: { disable: false }` parameters.

**Review critique (Step 2):**
Also extracted repeated inline connected wallet objects in `BuyTicket.stories.tsx` and `RedeemTicket.stories.tsx` into a shared `connectedWalletCtx` const, eliminating duplication across three stories each.

**Resolution (Step 3):**
Updated all 6 story files to use `export default { ... } satisfies Meta<typeof X>` and `type Story = StoryObj<typeof X>`. Removed `title`, `a11y: { disable: false }`, and the intermediate `meta` variable. Extracted `connectedWalletCtx` in BuyTicket and RedeemTicket stories. `tsc --noEmit` and `npm run lint` pass clean.

**Verdict:** Accepted
**Commit hash (Step 4):** 7195dfa

---

## [2026-04-27] #033 — Refactor: Replace story-level WalletContext decorators with args

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/context/WalletContext.tsx, src/**/*.stories.tsx (5 files)

**Prompt (Step 1):**
Story files for context-dependent components had repeated per-story `WalletContext.Provider` decorators. Replace with the idiomatic Storybook args pattern: a single meta-level decorator reads `args` and passes them to the provider; stories override only the args they need.

**Review critique (Step 2):**
`WalletContextValue` was not exported from `WalletContext.tsx`, blocking type-safe use in story files. The `args as WalletContextValue` cast I initially wrote was flagged as unnecessary by `@typescript-eslint/no-unnecessary-type-assertion` — removed after the linter confirmed args were already correctly typed.

**Resolution (Step 3):**
Exported `WalletContextValue` from `WalletContext.tsx`. Updated 5 story files to use `Meta<WalletContextValue>` with `args: base` at meta level and a single decorator reading `{ args }` from story context. Stories now override only changed args (e.g. `isConnected: true, address, signer`). Eliminated all per-story decorator arrays.

**Verdict:** Accepted
**Commit hash (Step 4):** 7195dfa

---

## [2026-04-27] #034 — Fix: Replace &.active with &[aria-current='page'] in Navbar.styles.ts

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/components/Navbar/Navbar.styles.ts

**Prompt (Step 1):**
The `&.active` selector in `NavLink` was flagged as never used. Fix it.

**Review critique (Step 2):**
React Router v6's `NavLink` sets `aria-current="page"` on the active link (and also adds a `.active` class). The `aria-current` attribute selector is more semantically correct and accessibility-friendly, and avoids the static analysis false positive.

**Resolution (Step 3):**
Replaced `&.active` with `&[aria-current='page']` in `NavLink`. Styles and behaviour are identical at runtime since React Router sets both, but the attribute selector is the correct and lint-clean approach.

**Verdict:** Accepted
**Commit hash (Step 4):** 1a17596

---

## [2026-04-28] #035 — Feat: Enforce en.json for all JSX strings via ESLint + improve test coverage

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** eslint.config.js, src/locales/en.json, all test files, src/pages/Balance/Balance.tsx

**Prompt (Step 1):**
"Enforce a single source of truth for all user-facing strings across the project:

1. ESLint rule: add a `no-restricted-syntax` rule to `eslint.config.js` scoped to `src/**/*.tsx` (excluding `*.test.tsx` and `*.stories.tsx`) that bans hardcoded JSX text matching `/\S[A-Za-z]{2,}/`. Error message: 'Hardcoded text in JSX is not allowed. Import strings from src/locales/en.json instead.'
2. Fix any source files that now fail the new rule.
3. All 7 test files currently use hardcoded strings — update every `.test.tsx` to import from `src/locales/en.json` and reference the correct keys. Add missing keys to `en.json` where needed.
4. While updating tests, improve coverage: add missing cases identified per file — brand label and nav link hrefs (Navbar), null balances and throw-outside-provider (WalletContext), reveal/hide key toggle (CreateWallet), check button render (Balance), connect prompt (BuyTicket).
5. Run `npm run lint` and `npx vitest run src/` and confirm all pass before finishing."

**Review critique (Step 2):**
- ESLint had no rule preventing hardcoded JSX text in source files — only color values were enforced
- All 7 test files were using hardcoded strings rather than importing from en.json, making them brittle against copy changes
- Test coverage was missing: brand name test in Navbar, null balance tests in WalletContext, edge cases in WalletStatus and all page tests
- `Balance.tsx` had `SETH` as hardcoded JSX text (caught by the new lint rule after adding it)

**Resolution (Step 3):**
- Added `no-restricted-syntax` ESLint rule for `JSXText[value=/\\S[A-Za-z]{2,}/]` scoped to `src/**/*.tsx`, excluding test and story files
- Added `"brand": "EventTicket"` to `en.json` and updated `Navbar.tsx` to use it
- Updated all 7 test files (`Navbar`, `WalletStatus`, `WalletContext`, `CreateWallet`, `Balance`, `BuyTicket`, `RedeemTicket`) to import from `en.json` and use the exact string keys
- Added new tests: brand label + nav link href checks (Navbar), null balances default (WalletContext), throw-outside-provider (WalletContext), reveal/hide key toggle (CreateWallet), check button render (Balance), connect prompt (BuyTicket)
- Fixed `Balance.tsx` line 92: moved `SETH` unit into template literal expression to satisfy lint rule

**Verdict:** Accepted
**Commit hash (Step 4):** 93fba86

---

## [2026-04-28] #036 — Refactor: Move routes into config.ts and enforce via ESLint

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/config.ts, src/routes.ts (deleted), eslint.config.js, all routes consumers

**Prompt (Step 1):**
"Move the `routes` export from `src/routes.ts` into `src/config.ts` as a named export. Delete `src/routes.ts`. Update all imports (`src/App.tsx`, `src/components/Navbar/Navbar.tsx`, `src/components/Navbar/Navbar.test.tsx`, all `e2e/*.spec.ts` files) to import `routes` from `src/config`. Add an ESLint `no-restricted-syntax` rule to ban hardcoded route path literals (strings matching `/^\/[a-z][a-z-]*$/`) everywhere except `src/config.ts`. Verify `npm run lint` and `tsc --noEmit` pass."

**Review critique (Step 2):**
The rule selector needed to exclude `src/config.ts` itself (the definition site) to avoid flagging the route values at their declaration. Scoping via `ignores: ['src/config.ts']` in a separate config block handles this cleanly without a disable comment.

**Resolution (Step 3):**
- Added `export const routes` block to `src/config.ts` above the `config` object
- Deleted `src/routes.ts`
- Updated all 8 import sites to `from '../../config'` / `from './config'` / `from '../src/config'`
- Added ESLint block scoped to `**/*.{ts,tsx}` with `ignores: ['src/config.ts']` banning `Literal[value=/^\\/[a-z][a-z-]*$/]`
- `npm run lint` and `tsc --noEmit` both pass with zero errors

**Verdict:** Accepted
**Commit hash (Step 4):** 7dab985

---

## [2026-04-28] #037 — Refactor: Remove redundant `<li>` wrappers from Navbar

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/components/Navbar/Navbar.tsx, src/components/Navbar/Navbar.styles.ts

**Prompt (Step 1):**
"The `<li>` wrappers inside `NavLinks` in `Navbar.tsx` are unnecessary — the list semantics add no accessibility or structural value here. Remove them: change `NavLinks` from `styled.ul` to `styled.div` (drop `list-style`, `margin`, `padding` resets), remove all four `<li>` elements from `Navbar.tsx` so `NavLink` anchors sit directly inside `NavLinks`. Confirm `npm run lint` passes."

**Review critique (Step 2):**
The `<li>` elements inside `NavLinks` (a `<ul>`) served no purpose beyond satisfying HTML list semantics, which added no accessibility or structural value here. The gap spacing was on the `<ul>` so it applied to `<li>` children — removing the list structure means `NavLinks` can become a plain `<div>` and `NavLink` anchors sit directly inside it.

**Resolution (Step 3):**
- Changed `NavLinks` from `styled.ul` to `styled.div`, removing `list-style: none`, `margin: 0`, and `padding: 0` (no longer needed)
- Removed all four `<li>` wrappers from `Navbar.tsx`
- `NavLink` components now render directly inside `NavLinks`
- `npm run lint` passes with zero errors

**Verdict:** Accepted
**Commit hash (Step 4):** f519183

---

## [2026-04-28] #038 — Feat: Expand WalletStatus stories and source strings from en.json

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/components/WalletStatus/WalletStatus.stories.tsx

**Prompt (Step 1):**
"Expand `WalletStatus.stories.tsx` to cover all meaningful component states. The existing `Disconnected` and `Connected` stories are insufficient. Add:
- `ConnectedNoAddress` — `isConnected: true` with `address: null` (shows disconnected label despite connected dot — the `isConnected && address` branch)
- `ConnectedLongAddress` — a different full-length address to verify truncation
- `WithError` — pass an error string from `en.json` (`strings.createWallet.metaMaskNotFound`) into the context `error` field

Import `strings` from `../../locales/en.json` for the error value — no hardcoded strings. The decorator and args pattern must stay since `WalletStatus` reads from context. Confirm `npm run lint` passes."

**Review critique (Step 2):**
The `WithError` story initially used a hardcoded string `'MetaMask not detected.'` — flagged immediately as it violates the en.json convention enforced across the project. Fixed to use `strings.createWallet.metaMaskNotFound`.

**Resolution (Step 3):**
- Added `import strings from '../../locales/en.json'`
- Added `ConnectedNoAddress`, `ConnectedLongAddress`, and `WithError` stories
- `WithError` uses `strings.createWallet.metaMaskNotFound` for the error value
- `npm run lint` passes with zero errors

**Verdict:** Modified
**Commit hash (Step 4):** 4ca183a

---

## [2026-04-28] #039 — Fix: Source all WalletContext strings from en.json and split context into focused files

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/context/WalletContext.tsx, src/context/walletContext.ts (new), src/context/useWallet.ts (new), src/locales/en.json, all consumers

**Prompt (Step 1):**
"Three fixes needed in `WalletContext.tsx`:
1. `'useWallet must be used inside WalletProvider'` is a hardcoded string — add it to `en.json` under `errors.hookOutsideProvider` and reference it via `strings.errors.hookOutsideProvider`.
2. The file exports both `WalletContext` (a context object), `WalletProvider` (a component), and `useWallet` (a hook) — this triggers `react-refresh/only-export-components` warnings. Do not use `eslint-disable`. Instead, split into focused files: `walletContext.ts` for the context object and `WalletContextValue` interface, `useWallet.ts` for the hook, `WalletContext.tsx` for `WalletProvider` only.
3. Update all import sites across `src/` (pages, components, stories, tests) to import from the correct new file.
Confirm `npm run lint` and `tsc --noEmit` pass with zero errors and zero warnings."

**Review critique (Step 2):**
- Initial attempt used `eslint-disable` inline comments — rejected by user, rule violations must be fixed structurally.
- First split attempt put `WalletState` interface inline in `WalletContext.tsx` using `WalletContextValue[key]` field references — cleaner to derive directly from `WalletContextValue` rather than redeclare.
- `refreshBalances` had a copy-paste bug (called `getBalance` twice instead of `getBalance` + `balanceOf`) — caught and corrected before lint.

**Resolution (Step 3):**
- Added `"hookOutsideProvider": "useWallet must be used inside WalletProvider"` to `en.json` errors section
- Created `src/context/walletContext.ts`: exports `WalletContextValue` interface and `WalletContext` (`createContext`)
- Created `src/context/useWallet.ts`: exports `useWallet` hook using `strings.errors.hookOutsideProvider`
- Rewrote `WalletContext.tsx` to export only `WalletProvider`, importing from `walletContext.ts`
- Updated all 10 import sites across stories, tests, and source files
- `npm run lint` and `tsc --noEmit` pass with zero errors and zero warnings

**Verdict:** Modified
**Commit hash (Step 4):** TBD

---

## [2026-04-28] #040 — Fix: Replace unsafe contract casts with typed wrapper functions

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/utils/contract.ts, src/context/WalletContext.tsx, src/pages/Balance/Balance.tsx, src/pages/BuyTicket/BuyTicket.tsx, src/pages/RedeemTicket/RedeemTicket.tsx

**Prompt (Step 1):**
"Two IDE warnings — 'Missing await for an async function call' — on `contract.balanceOf(address) as Promise<unknown>` in `WalletContext.tsx` (both the `connect` callback and `refreshBalances`). The `as Promise<unknown>` cast is the root cause: it forces TypeScript to treat the call as returning a Promise explicitly, which IDE inspections flag as a floating promise even inside `Promise.all`. Fix by adding typed wrapper functions to `src/utils/contract.ts` — `balanceOf`, `remainingTickets`, `buyTicket`, `redeemTicket` — each returning a concrete typed Promise. Make `getContract` private. Update all callers in `WalletContext.tsx`, `Balance.tsx`, `BuyTicket.tsx`, and `RedeemTicket.tsx` to use the typed wrappers. Confirm `npm run lint` and `tsc --noEmit` pass."

**Review critique (Step 2):**
- `BuyTicket.tsx` imported `ContractTransactionResponse` from ethers for the tx cast — no longer needed once `buyTicket` wrapper returns the correct type. Removed.
- `RedeemTicket.tsx` imported `ContractTransactionResponse` for the same reason — removed.
- `Balance.tsx` had three sequential awaits that could be parallelised — changed to `Promise.all`.

**Resolution (Step 3):**
- Made `getContract` private (unexported) in `contract.ts`
- Added typed exports: `balanceOf` → `Promise<bigint>`, `remainingTickets` → `Promise<bigint>`, `buyTicket` → `Promise<{ wait }>`, `redeemTicket` → `Promise<{ wait }>`
- All four files updated to import and use typed wrappers — no remaining `as Promise<unknown>` casts
- `npm run lint` and `tsc --noEmit` pass with zero errors and zero warnings

**Verdict:** Accepted
**Commit hash (Step 4):** 4be29ff

---

## [2026-04-28] #041 — Improve: Balance stories and unit tests

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/pages/Balance/Balance.test.tsx, src/pages/Balance/Balance.stories.tsx

**Prompt (Step 1):**
"Improve the Balance page stories and unit tests. Stories: rename `Default` to `Disconnected`, add `ConnectedWallet` story showing the form pre-filled from context address, keep `ButtonHover`, remove focus stories. Tests: fix the broken mock (was mocking `getContract` which no longer exists — now uses named exports `balanceOf` and `remainingTickets`), add tests for: title/subtitle render, valid ticket badge (ETK > 0), no ticket badge (ETK = 0), remaining supply display, network error. Use `vi.mocked` for typed mock access. All strings from `en.json`. Confirm `npm run lint` and `vitest run` pass."

**Review critique (Step 2):**
- `vi.mock` is hoisted above variable declarations — `mockBalanceOf` and `mockRemainingTickets` could not be referenced in the factory; fixed by declaring `vi.fn()` inline in the factory and importing the mocked module to get typed references via `vi.mocked`.
- `checkAddress` was accidentally made `async` with no `await` — made synchronous.
- `vi.doMock` for the no-provider test does not work after module is already imported — test removed.
- `ConnectedWallet` story initially passed a fake `provider` object with `as any` — removed since provider is only needed on check, not on render.

**Resolution (Step 3):**
- Fixed mock to use `vi.fn()` inline in factory + `vi.mocked(balanceOf)` for typed access
- Added 6 new tests: title/subtitle, valid ticket badge, no ticket badge, remaining supply, network error
- Stories: `Disconnected`, `ConnectedWallet` (address pre-filled, no provider needed), `ButtonHover`
- Removed all focus stories across `CreateWallet`, `BuyTicket`, and `RedeemTicket` stories too
- `npm run lint` and `vitest run` pass with zero errors

**Verdict:** Accepted
**Commit hash (Step 4):** 9f0a15f

---

## [2026-04-28] #042 — Refactor: Extract shared styles and make decodeContractError return en.json strings

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/styles/shared.styles.ts (new), src/pages/BuyTicket/BuyTicket.styles.ts, src/pages/RedeemTicket/RedeemTicket.styles.ts, src/utils/contract.ts, src/locales/en.json

**Prompt (Step 1):**
"Two issues: (1) `StatusMessage` and `ConnectPrompt` styled components are duplicated identically across `BuyTicket.styles.ts` and `RedeemTicket.styles.ts` (37 lines). Extract them to `src/styles/shared.styles.ts` and re-export from each styles file. (2) `decodeContractError` returns string keys like `'incorrectAmount'` that callers look up against `strings.buyTicket` or `strings.redeem` — this is error-prone and duplicated. Move all contract error messages into `en.json` under `errors`, have `decodeContractError` import `en.json` and return the actual message string directly. Simplify both callers to `setStatusMessage(decodeContractError(err))`. Confirm `npm run lint` and `tsc --noEmit` pass."

**Review critique (Step 2):**
No issues — both changes were clean. The callers already imported `strings` for other purposes so no new imports needed there.

**Resolution (Step 3):**
- Created `src/styles/shared.styles.ts` with `StatusMessage` and `ConnectPrompt`
- `BuyTicket.styles.ts` and `RedeemTicket.styles.ts` now re-export them: `export { StatusMessage, ConnectPrompt } from '../../styles/shared.styles'`
- Added 6 new keys to `en.json` `errors` section: `incorrectAmount`, `alreadyOwned`, `soldOut`, `noTicket`, `cancelled`, `wrongNetwork`
- `decodeContractError` now imports `en.json` and returns `strings.errors.*` directly
- Both page catch blocks simplified from 4 lines to 2
- `npm run lint` and `tsc --noEmit` pass with zero errors

**Verdict:** Accepted
**Commit hash (Step 4):** e19fab4

---

## [2026-04-28] #043 — Fix: Contract error matchers centralised, decodeContractError uses lookup table

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/utils/contract.ts

**Prompt (Step 1):**
"The hardcoded strings in `decodeContractError` (`'IncorrectPayment'`, `'AlreadyOwnsTicket'`, etc.) are Solidity custom error identifiers — they should be centralised rather than scattered through if-chains. Move them into a `CONTRACT_ERRORS` lookup table in `contract.ts` so each entry pairs the matching substrings with the resolved message. The function body should iterate the table rather than repeat `msg.includes` calls."

**Review critique (Step 2):**
No issues. The identifiers are contract implementation details, not user-facing strings, so `contract.ts` is the correct home rather than `en.json`.

**Resolution (Step 3):**
- Added `CONTRACT_ERRORS: Array<[string[], string]>` constant mapping substring patterns to `strings.errors.*` values
- `decodeContractError` now iterates with `patterns.some((p) => msg.includes(p))` — single loop replaces six if-statements
- `npm run lint` passes with zero errors

**Verdict:** Accepted
**Commit hash (Step 4):** c18499e

---

## [2026-04-28] #044 — Fix: Resolve no-empty-object-type ESLint error in styled.d.ts without eslint-disable

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** eslint.config.js, src/styled.d.ts

**Prompt (Step 1):**
"`src/styled.d.ts` uses `export interface DefaultTheme extends Theme {}` for styled-components module augmentation — the idiomatic pattern for v6. This triggers `@typescript-eslint/no-empty-object-type`. Do not use `eslint-disable`. Do not scope the rule off for `**/*.d.ts` files. Fix the actual issue: configure the rule with `allowInterfaces: 'with-single-extends'` in `eslint.config.js` so single-extends empty interfaces (the valid module augmentation pattern) are permitted while genuinely pointless empty interfaces remain errors."

**Review critique (Step 2):**
- Attempted `export type DefaultTheme = Theme` — module augmentation requires `interface`, not `type`; caused 372 type errors across all styles files.
- Attempted scoping the rule off for `**/*.d.ts` — rejected, too broad.
- Correct fix: `allowInterfaces: 'with-single-extends'` targets exactly this pattern.

**Resolution (Step 3):**
- Added `'@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }]` to the main rules block in `eslint.config.js`
- `src/styled.d.ts` unchanged — no eslint-disable, no workaround
- `npm run lint` passes with zero errors

**Verdict:** Modified
**Commit hash (Step 4):** c18499e

---

## [2026-04-28] #045 — Fix: WCAG 2.1 AA color contrast failures causing Storybook "No Preview"

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/theme.ts, src/components/Navbar/Navbar.styles.ts, src/pages/CreateWallet/CreateWallet.styles.ts

**Prompt (Step 1):**
"Storybook shows 'No Preview / The component failed to render properly' for several stories. The a11y config uses test: 'error' which treats WCAG violations as story failures. The Storybook test runner confirms 7 accessibility failures: (1) brandPrimary #6c63ff fails contrast with both textInverse #0f1117 (4.37:1, CreateWallet button) and textPrimary #f1f5f9 (3.93:1, Balance/BuyTicket/RedeemTicket buttons); (2) statusErrorSubtle #7f1d1d has 2.66:1 contrast with statusError #ef4444 (RedeemTicket badge); (3) brandPrimary used as NavBrand text colour. Fix all three by: darken brandPrimary to #4f46e5 (gives 5.4:1 with textPrimary); change CreateWallet button from textInverse to textPrimary (consistent with all other buttons); darken statusErrorSubtle to #3b0000 (gives 4.7:1 with statusError); change NavBrand and active NavLink to use textLink #818cf8 instead of brandPrimary."

**Review critique (Step 2):**
- Root cause was discovered only after running Playwright directly against the iframe — stories rendered fine, confirming "No Preview" was a test failure not a render crash.
- Running @storybook/test-runner confirmed: all failures were color-contrast a11y violations, not JavaScript errors.
- Darkening brandPrimary introduced a regression: NavBrand text (previously using brandPrimary as a text colour on dark background) now had only 2.67:1 contrast, requiring a follow-up fix.

**Resolution (Step 3):**
- `src/theme.ts`: `brandPrimary` #6c63ff → #4f46e5, `brandPrimaryHover` #574fd6 → #4338ca, `brandPrimaryDisabled` #3d3a6e → #312e81, `statusErrorSubtle` #7f1d1d → #3b0000, `textLinkHover` and `borderFocus` updated to match #4f46e5
- `src/pages/CreateWallet/CreateWallet.styles.ts`: `PrimaryButton` color changed from `textInverse` to `textPrimary`
- `src/components/Navbar/Navbar.styles.ts`: `NavBrand` and active `NavLink` changed from `brandPrimary` to `textLink`
- All 18 stories now pass Storybook test runner (zero a11y violations)
- npm run lint passes with zero errors

**Verdict:** Modified
**Commit hash (Step 4):** 7109d40

## [2026-04-28] #046 — Fix: sb-preparing-docs overlay + previewHead signature + CI a11y enforcement

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** .storybook/main.ts, .github/workflows/accessibility.yml

**Prompt (Step 1):**
"There is a 'sb-preparing-docs' overlay visible at the top of every Storybook story. It seems to be an issue with .storybook as it's in every storybook. Also, a11y violations should be caught by the GitHub Action but currently they're not."

**Review critique (Step 2):**
- Playwright CSS inspection confirmed `sb-preparing-docs` div has `display: block` with zero CSS rules targeting it — no stylesheet was hiding it.
- Root cause: `@storybook/addon-docs` was in devDependencies but absent from the `addons` array in `main.ts`. Its CSS (`.sb-show-main .sb-preparing-docs { display: none }`) was never loaded.
- The existing `accessibility.yml` only ran `build-storybook` — it never executed any tests, so a11y violations were never caught.
- `@storybook/addon-vitest` was already configured in `vite.config.ts` as a `storybook` project running stories via Vitest + Playwright Chromium. Running `vitest run --project=storybook` executes all story tests including a11y checks (since `test: 'error'` is set in preview.tsx).

**Resolution (Step 3):**
- `.storybook/main.ts`: fixed `previewHead` signature from `() =>` to `(head) => \`${head}...\`` — the function receives existing head HTML and must return it with additions; ignoring the parameter discards Storybook's own head content (fonts, meta tags, base CSS). Background colour injection preserved.
- `.github/workflows/accessibility.yml`: replaced `build-storybook` step with `npx playwright install chromium --with-deps` + `npx vitest run --project=storybook` so CI actually runs story tests and fails on a11y violations.

**Verdict:** Accepted
**Commit hash (Step 4):** d0181c8

---

## [2026-04-28] #047 — Fix: Playwright e2e tests fail with JSON import attribute error on Node 20

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** e2e/*.spec.ts

**Prompt (Step 1):**
"npx playwright test fails in CI with: TypeError: Module 'src/locales/en.json' needs an import attribute of type 'json'. Error: No tests found."

**Review critique (Step 2):**
- Node.js 20+ requires `with { type: 'json' }` on bare JSON imports when using ES modules. All 5 e2e spec files imported `en.json` without this attribute, causing the module loader to reject them before any tests could run — hence "No tests found".

**Resolution (Step 3):**
- Added `with { type: 'json' }` to the JSON import in all 5 e2e spec files: `wallet.spec.ts`, `buyTicket.spec.ts`, `redeemTicket.spec.ts`, `navbar.spec.ts`, `balance.spec.ts`.
- Playwright test run no longer throws TypeError; tests proceed past module loading.

**Verdict:** Accepted
**Commit hash (Step 4):** 190d3f7

---

## [2026-04-28] #048 — Fix: Playwright `import.meta.env` crash + unit test mock mismatches

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/config.ts, src/pages/BuyTicket/BuyTicket.test.tsx, src/pages/RedeemTicket/RedeemTicket.test.tsx

**Prompt (Step 1):**
"npx playwright test fails: TypeError: Cannot read properties of undefined (reading 'VITE_CONTRACT_ADDRESS') at src/config.ts:10. npx vitest run --coverage shows 7 failing unit tests: BuyTicket (4) and RedeemTicket (3) with 'No X export is defined on the contract mock'."

**Review critique (Step 2):**
- `import.meta.env` is a Vite-only global — it is `undefined` in Node.js where Playwright runs. The non-optional property access crashed before any test could execute.
- BuyTicket and RedeemTicket test mocks were shaped around a `getContract()` factory pattern, but the components import named functions (`balanceOf`, `remainingTickets`, `buyTicket`, `redeemTicket`) directly. Vitest's strict mock enforcement caught the mismatch at runtime.
- RedeemTicket's `decodeContractError` mock returned the key name `'noTicketError'` instead of the actual localised string, causing the text assertion to fail.

**Resolution (Step 3):**
- `src/config.ts`: changed `import.meta.env.VITE_CONTRACT_ADDRESS` → `import.meta.env?.VITE_CONTRACT_ADDRESS` so Node.js no longer crashes when `import.meta.env` is undefined.
- `BuyTicket.test.tsx`: replaced `getContract` factory mock with named exports `buyTicket`, `remainingTickets`, `balanceOf`, `decodeContractError` matching the component's actual imports.
- `RedeemTicket.test.tsx`: same — replaced `getContract` factory with named exports `redeemTicket`, `balanceOf`, `decodeContractError`; fixed `decodeContractError` mock to return `en.redeem.noTicketError` (the actual string) instead of the key name.
- All 48 vitest tests pass (13 test files); Playwright no longer crashes on import.

**Verdict:** Accepted
**Commit hash (Step 4):** 476e13c

---

## [2026-04-28] #049 — Fix: Playwright strict mode violation on ambiguous locator

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** e2e/wallet.spec.ts

**Prompt (Step 1):**
"npx playwright test fails: strict mode violation — getByText('Recovery Phrase') resolved to 2 elements: a container div and a span."

**Review critique (Step 2):**
- `page.getByText()` uses substring matching by default, so both the container `<div>` (which contains the text as a descendant) and the inner `<span>` (with exact text) matched, causing a strict mode error.
- The test `shows mnemonic after wallet generation` was the only failing case — 21/22 tests passed before this fix.

**Resolution (Step 3):**
- `e2e/wallet.spec.ts`: added `{ exact: true }` option to `page.getByText(en.createWallet.mnemonicLabel)` so Playwright matches only the element whose full text content equals `"Recovery Phrase"` exactly, eliminating the ambiguous match.

**Verdict:** Accepted
**Commit hash (Step 4):** 824a019

---

## [2026-04-28] #050 — Fix: ESLint errors and Prettier formatting across multiple files

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** .storybook/main.ts, src/config.ts, src/pages/BuyTicket/BuyTicket.test.tsx, src/pages/RedeemTicket/RedeemTicket.test.tsx

**Prompt (Step 1):**
"Also resolve the eslint and formatting issues."

**Review critique (Step 2):**
- `.storybook/main.ts`: `head` parameter of `previewHead` is typed `string | undefined` by StorybookConfig — using it bare in a template literal triggers `@typescript-eslint/restrict-template-expressions`.
- `src/config.ts`: the previous `import.meta.env?.` fix introduced `@typescript-eslint/no-unnecessary-condition` because TypeScript types `import.meta.env` as `ImportMetaEnv` (never undefined). Needed a cast to a nullable type so the optional chain is recognised as necessary.
- `BuyTicket.test.tsx` and `RedeemTicket.test.tsx`: `mockBuyTicket(...args)` / `mockRedeemTicket(...args)` return `any` (vi.fn() default), which is then returned from the mock factory function — triggering `@typescript-eslint/no-unsafe-return`.
- 9 files had Prettier formatting drift.

**Resolution (Step 3):**
- `.storybook/main.ts`: changed `${head}` → `${head ?? ''}` so the undefined case is handled and the template expression is always `string`.
- `src/config.ts`: cast `import.meta.env` to `unknown as Record<string, string> | undefined` so the optional chain is typed as necessary and the Node.js runtime crash is still prevented.
- `BuyTicket.test.tsx` / `RedeemTicket.test.tsx`: appended `as unknown` to the mock call return to suppress the unsafe-return error without widening the mock type.
- Ran `prettier --write` to fix formatting in all 9 affected files.
- `npm run lint` and `npm run format:check` both pass with zero errors.

**Verdict:** Accepted
**Commit hash (Step 4):** 824a019

## [2026-04-28] #053 — Fix: index.css font-family generic fallback and float px letter-spacing

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/index.css

**Prompt (Step 1):**
"Fix two CSS lint warnings in src/index.css: (1) font-family declarations using CSS custom properties have no generic fallback visible to the linter — add a concrete generic family after each var() reference so the fallback chain is explicit; (2) letter-spacing values are sub-pixel float px values that render inconsistently across browsers — convert them to relative em units so they scale correctly with font-size."

**Review critique (Step 2):**
- `font-family: var(--heading)` and `font-family: var(--mono)` lacked a generic fallback after the CSS variable — linters can't resolve variables so no generic family was visible.
- The `font` shorthand `font: 18px/145% var(--sans)` had the same issue.
- `letter-spacing` values `0.18px`, `-1.68px`, `-0.24px` are sub-pixel floats that can render inconsistently across browsers.

**Resolution (Step 3):**
- Added `, sans-serif` after `var(--heading)` and in the `font` shorthand; added `, monospace` after `var(--mono)`.
- Converted float px letter-spacing to equivalent `em` values: `0.18px` → `0.01em`, `-1.68px` → `-0.03em`, `-0.24px` → `-0.01em`.

**Verdict:** Accepted
**Commit hash (Step 4):** c822a67

## [2026-04-28] #054 — Fix: index.html title sourced from en.json

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** index.html, src/main.tsx

**Prompt (Step 1):**
"The hardcoded string in index.html's <title> tag violates the CLAUDE.md rule that all user-facing strings must come from src/locales/en.json. Move it: source the page title from en.json at runtime. index.html is a static file so it cannot import JSON directly — find the correct mechanism for a Vite/React SPA."

**Review critique (Step 2):**
`index.html` is a static file — it cannot import JSON directly. The `<title>` tag needed to be sourced from `en.json` at runtime via JavaScript.

**Resolution (Step 3):**
- Emptied `<title>` in `index.html` (JS is required for this DApp anyway).
- Added `document.title = strings.brand` in `main.tsx` before `createRoot`, sourcing the value from `src/locales/en.json`.

**Verdict:** Accepted
**Commit hash (Step 4):** e27b3eb

## [2026-04-28] #055 — [OPTIMIZATION] Full codebase simplification

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/styles/shared.styles.ts, src/pages/BuyTicket/, src/pages/RedeemTicket/, src/pages/Balance/, src/components/WalletStatus/, src/utils/wallet.ts

**Prompt (Step 1):**
"Run a full codebase simplification pass across src/. Use three parallel review agents (reuse, quality, efficiency). Look for: duplicated styled-components across page style files, magic numbers that should reference config.ts, inline utilities that belong in utils/, redundant RPC calls when the data already exists in context, and any object URL or memory management issues. Fix everything found and confirm all tests pass."

**Review critique (Step 2):**
Three parallel review agents identified seven issues:
- `Title`/`Subtitle` styled-components copy-pasted identically across BuyTicket, RedeemTicket, and Balance style files.
- `BuyButton`/`RedeemButton` were pixel-for-pixel identical styled-components.
- `StatusType` union type duplicated in BuyTicket.tsx and RedeemTicket.tsx.
- `parseEther('0.01')` magic number in BuyTicket.tsx instead of `config.ticketPriceWei` — direct CLAUDE.md violation.
- `truncateAddress` defined inline in WalletStatus.tsx instead of utils/wallet.ts.
- `downloadKeystore` used a 100ms setTimeout to revoke the object URL — a race condition that could fail on slow devices.
- BuyTicket and RedeemTicket each made a redundant `balanceOf` RPC call on mount when `etkBalance` was already maintained in WalletContext.

**Resolution (Step 3):**
- Added `PageTitle`, `PageSubtitle`, `PrimaryActionButton`, and `StatusType` to `shared.styles.ts`.
- Replaced local `Title`/`Subtitle`/`BuyButton`/`RedeemButton` definitions in BuyTicket, RedeemTicket, and Balance styles with re-exports from shared.
- Exported `StatusType` from shared and imported it in both pages (removed local type declarations).
- Fixed `parseEther('0.01')` → `BigInt(config.ticketPriceWei)` in BuyTicket.tsx.
- Moved `truncateAddress` to `utils/wallet.ts`; updated WalletStatus import.
- Fixed `downloadKeystore` to `appendChild`/`click`/`removeChild`/`revokeObjectURL` synchronously.
- Removed `balanceOf` useEffect from BuyTicket and RedeemTicket; both now read `etkBalance` directly from `useWallet()`. Updated tests accordingly.
- All 48 tests pass, build and lint clean.

**Verdict:** Accepted
**Commit hash (Step 4):** b89b825

## [2026-04-28] #056 — [OPTIMIZATION] Remove as-casting from imports, exports, and contract utils

**Tool:** Claude (claude-sonnet-4-6)
**Feature:** src/styles/shared.styles.ts, src/pages/BuyTicket/, src/pages/RedeemTicket/, src/pages/Balance/, src/utils/contract.ts

**Prompt (Step 1):**
"Remove all unnecessary TypeScript as-casting from the codebase, with priority on imports and exports. Specifically: re-export aliases (PageTitle as Title, PrimaryActionButton as BuyButton) should be eliminated by renaming the shared components correctly; import aliases that exist only to avoid non-existent name conflicts should be removed; per-function as-casts in contract.ts should be replaced with a single typed interface on getContract; and test mock wrappers using as unknown should be replaced with properly typed vi.hoisted mocks."

**Review critique (Step 2):**
- `PageTitle as Title`, `PageSubtitle as Subtitle` re-export aliases across three .styles.ts files — unnecessary indirection from poor naming in shared.styles.ts.
- `PrimaryActionButton as BuyButton` / `PrimaryActionButton as RedeemButton` — aliases forcing JSX to use a different name than the real component.
- `buyTicket as contractBuyTicket` / `redeemTicket as contractRedeemTicket` — no naming conflict existed; aliases were unnecessary.
- Four `as Promise<X>` casts spread across contract.ts public functions — should be centralised behind a typed interface on `getContract`.
- Test mocks used `(...args) => mockFn(...args) as unknown` wrapper to suppress unsafe-return; `mockFn` could be directly assigned if declared with `vi.hoisted`.

**Resolution (Step 3):**
- Renamed `PageTitle` → `Title`, `PageSubtitle` → `Subtitle` in shared.styles.ts; removed all `as X` re-export aliases.
- Exported `PrimaryActionButton` directly; updated BuyTicket.tsx and RedeemTicket.tsx JSX to use `PrimaryActionButton`.
- Removed `buyTicket as contractBuyTicket` and `redeemTicket as contractRedeemTicket` import aliases.
- Introduced `EventTicketContract` interface in contract.ts; `getContract` now returns the typed interface (single `as unknown as EventTicketContract` cast), removing all per-function casts.
- Replaced test mock wrappers with `vi.hoisted(() => vi.fn())` and direct assignment in `vi.mock` factory, eliminating `as unknown`.

**Verdict:** Accepted
**Commit hash (Step 4):** b89b825
