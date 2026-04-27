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
**Commit hash (Step 4):** TBD
