# Agent Instructions

> This file is mirrored across CLAUDE.md, AGENTS.md, and GEMINI.md so the same instructions load in any AI environment.

---

## Quick Start - READ THIS FIRST

> **This section eliminates exploration time. Use it before every task.**

### Project: Octili Cashier POS Terminal
- **Stack**: React 18 + TypeScript + Vite + TailwindCSS + Zustand
- **Port**: http://localhost:5173
- **Start**: `npm run dev`
- **Build**: `npm run build`
- **TypeScript check**: `npx tsc --noEmit`

### Directory Structure (MEMORIZE THIS)
```
src/
├── App.tsx                    # All routes defined here (lazy loaded)
├── pages/                     # One folder per module
│   ├── Auth/                  # Login (username/password), PIN entry
│   ├── POS/                   # Main POS interface - game selection
│   ├── Games/                 # Games grid - lottery games with timers
│   ├── GamePlay/              # Game selection (multipliers, bet amount, draws)
│   ├── Cart/                  # Pending tickets before purchase
│   ├── Checkout/              # Payment processing
│   ├── PaymentOfWinnings/     # Scan QR or enter ticket number to pay winnings
│   ├── Results/               # Draw results for all games
│   ├── Menu/                  # Main menu (Reports, Cash, History, Exit)
│   ├── Reports/               # Date range reports, daily reports
│   ├── CashCollection/        # Track payouts to winning players
│   ├── CashReplenishment/     # Add cash to balance from payments
│   ├── History/               # Full history of printed tickets
│   ├── Transactions/          # Transaction history
│   ├── Settings/              # Cashier settings
│   └── QR/                    # QR Replenishment & QR Payout for player accounts
├── components/
│   ├── ui/                    # Primitives: Button, Input, Modal, NumPad, etc.
│   ├── shared/                # Complex: GameCard, TicketItem, MultiplierSelector
│   └── layout/                # Header, BottomNav, Layout
├── types/                     # TypeScript interfaces per module
├── data/                      # Mock data files (games, tickets, etc.)
├── stores/                    # Zustand stores (authStore, cartStore, balanceStore)
├── hooks/                     # Custom hooks
└── lib/                       # Utilities (cn() for classnames, formatCurrency, etc.)
```

### Module Page Pattern (ALWAYS FOLLOW THIS)
```
/src/pages/{MODULE}/
├── {MODULE}Page.tsx           # Main view for the module
├── {Entity}List.tsx           # List view with filters (if needed)
├── {Entity}Detail.tsx         # Detail view (if needed)
└── index.ts                   # Export all components
```

### Route Pattern in App.tsx
```tsx
// 1. Add lazy import at top
const MyPage = lazy(() => import('@/pages/MODULE/MyPage').then(m => ({ default: m.MyPage })))

// 2. Add route inside <Route path="module">
<Route path="module">
  <Route index element={<ModulePage />} />
  <Route path="detail/:id" element={<DetailPage />} />
</Route>
```

### Quick Commands
```bash
# Start dev server
npm run dev

# Type check (run after every change!)
npx tsc --noEmit

# Build for production
npm run build

# Git workflow (auto-push)
git add . && git commit -m "feat(module): description" && git push
```

### DO NOT EXPLORE - JUST USE THIS MAP
| Need | Location |
|------|----------|
| Add new page | `src/pages/{MODULE}/NewPage.tsx` + update `App.tsx` |
| Add UI component | Check `src/components/ui/` first |
| Add types | `src/types/{module}.types.ts` |
| Add mock data | `src/data/{module}-mock-data.ts` |
| Add route | `src/App.tsx` (lazy import + Route) |
| Find existing page | `src/pages/{MODULE}/{Module}Page.tsx` |

---

## BRAND GUIDELINES - OCTILI

> **This app must match the Octili Admin Panel visual style - same tones, same feel.**

### Color Palette

```css
/* Octili Brand Colors - Green/Teal Palette */
--color-green: #24BD68;          /* Primary green - buttons, accents, success */
--color-teal: #00A77E;           /* Teal - hover states, secondary actions */
--color-deep-teal: #006E7E;      /* Deep teal - gradients, active states */
--color-dark-blue: #28455B;      /* Dark blue - headers, labels */
--color-charcoal: #282E3A;       /* Charcoal - primary text */

/* Semantic Colors */
--color-success: #24BD68;        /* Green - positive actions, valid tickets */
--color-danger: #ef4444;         /* Red - cancel, invalid, destructive actions */
--color-info: #3b82f6;           /* Blue - info bars, timers */
--color-warning: #eab308;        /* Yellow - warnings, pending states */

/* Neutral Colors */
--color-background: #f8fafc;     /* Light gray - page background */
--color-surface: #ffffff;        /* White - cards, modals */
--color-text: #282E3A;           /* Charcoal - primary text */
--color-text-muted: #64748b;     /* Gray - secondary text */
--color-border: #e2e8f0;         /* Light gray - borders */
```

### Button Styles

| Button Type | Background | Text | Use Case |
|-------------|------------|------|----------|
| Primary | `--color-green` (#24BD68) | White | Main actions: Buy, OK, Confirm |
| Success | `--color-green` (#24BD68) | White | Payment, Valid, Positive |
| Danger | `--color-danger` (red) | White | Cancel, Delete, Invalid |
| Secondary | White with border | `--color-dark-blue` | Secondary actions |
| Info | `--color-teal` (#00A77E) | White | Info, timers, status |

### Typography

- **Font Family**: System fonts (Inter, -apple-system, sans-serif)
- **Headings**: Bold, dark blue (`--color-dark-blue`)
- **Body**: Regular, charcoal (`--color-charcoal`)
- **Labels**: Medium, muted (`--color-text-muted`)

### Component Patterns

1. **Glass Morphism** - Backdrop blur, semi-transparent backgrounds
2. **Animated Backgrounds** - Liquid blob effects with Octili colors
3. **Game Cards** - Grid of 2 columns, image + title + countdown timer
4. **Bottom Navigation** - 5 items: Games, Results, Menu, QR, Cart
5. **Modals** - Centered, white background, rounded corners
6. **NumPad** - Large touch targets (48px+), colored confirm/back buttons
7. **Lists** - Clean rows with dividers, action buttons on right

---

## APPLICATION FEATURES (FROM POS TERMINAL SPEC)

> **Reference: POS Terminal Instructions PDF - functional spec only**

### 1. Login/Authorization
- Username and password fields
- Optional registration code checkbox
- Support phone number displayed
- Octili logo at top

### 2. Games Screen (Main)
- Grid layout (2 columns) of available lottery games
- Each game shows: name, image, countdown timer to next draw
- "Payment of winnings" green button in top-right position
- Bottom navigation: Games | Results | Menu | QR | Cart

### 3. Game Play Screen
- Back arrow + Game title + Cart icon in header
- Timer bar showing time until draw closes + Draw number
- Market selection (multipliers: X2, X3, X5, X10, X15, X25, X50, X100)
- OR number selection grid (for keno/number games)
- Bet Amount selector (dropdown: 0.5, 1.0, 2.0, 5.0, 10.0, 20.0, 50.0, 100.0, 200.0)
- Number of Draws selector (1, 2, etc.)
- Bottom actions: Buy | Add to Cart | Clear

### 4. Purchase Confirmation Modal
- Shows: selected markets/numbers, price, number of draws
- OK (green) and Cancel (red) buttons
- Prints ticket on confirmation

### 5. Payment of Winnings
- Barcode input field (manual entry)
- "Camera scan Qrcode" button (green)
- Results: "Valid ticket - Win: X" / "Ticket not valid" / "Paid ticket"
- Payment button to confirm payout

### 6. Results Screen
- List of all games with "Printing" option and arrow to details
- Detail view shows: Number, Date, Time, Result in table
- Print option available

### 7. Menu Screen
- Operator ID and Balance displayed at top
- Options: Reports menu, Cash collection, Cash replenishment, History, Exit
- Support phone displayed at bottom

### 8. Reports Menu
- Date range selector (start date, end date)
- "Show report days" button
- Report display: Games breakdown, Sales, Pay, Abolition, Balance
- Print report option

### 9. Cash Collection
- Sum input field with NumPad
- "Cash collection" and "All the money" buttons
- Confirmation modal
- Decreases balance, prints receipt

### 10. Cash Replenishment
- Sum input field with NumPad
- Confirmation modal
- Increases balance, prints receipt

### 11. History
- List of all printed tickets with date/time, type, amount
- Print option for history

### 12. QR Screen
- QR Replenishment button
- QR Payout button
- Camera scanner for player QR codes

### 13. Cart
- List of pending tickets before purchase
- Delete individual or all tickets
- Total amount displayed

---

## COMMIT MESSAGE DOCUMENTATION

> **Rule: Every commit must document the user's request and the AI's interpretation.**

### Commit Message Format

```
feat/fix/refactor(module): Brief description

## User Request (Original)
[Copy the user's exact prompt/request as-is, in their original language]

## Interpretation
[Explain in English what you understood the user wanted]

## Actions Taken
- [Action 1: What was done and why]
- [Action 2: What was done and why]

## Files Changed
- `path/to/file.tsx` - Description of changes

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### Why This Matters

1. **Traceability** - Future developers can understand the original intent
2. **Learning** - Shows how prompts translate to actions
3. **Debugging** - If something breaks, we know what was requested vs implemented
4. **Documentation** - Creates a living history of decisions

---

## CODE DOCUMENTATION STANDARDS

> **Rule: Write detailed English comments so any junior developer can understand the code.**

### File-Level Documentation

Every file MUST start with a detailed header comment block explaining:

```typescript
/**
 * ============================================================================
 * COMPONENT/MODULE NAME
 * ============================================================================
 *
 * Purpose: What this file does and why it exists
 *
 * Features:
 * - Feature 1
 * - Feature 2
 *
 * Usage: How to use this component/module
 *
 * Dependencies: Key libraries or modules this depends on
 *
 * @author Octili Development Team
 * @version X.X.X
 * @lastUpdated YYYY-MM-DD
 */
```

### Function/Component Documentation

Every function, hook, or component MUST have JSDoc comments:

```typescript
/**
 * Brief description of what this function does.
 *
 * @param paramName - Description of the parameter
 * @returns Description of what is returned
 *
 * @example
 * const result = myFunction('input')
 */
```

### Inline Comments

Use inline comments for:
- Complex business logic (betting calculations, payout logic)
- Non-obvious code decisions
- Workarounds or edge cases
- TODO items with context

### Language

- All comments MUST be in English
- Use clear, simple language
- Avoid jargon unless necessary (and explain it if used)

---

## DESIGN PHILOSOPHY - APPLE-LEVEL QUALITY

> **Rule: All agents are world-class Apple designers when creating UI/UX.**

### Design Mindset

1. **Think Like Apple Designers**
   - Every pixel matters
   - Simplicity is the ultimate sophistication
   - If it looks complicated, it IS complicated - simplify it
   - White space is not empty space - it's breathing room

2. **Users Are Regular People (Cashiers)**
   - They don't read manuals
   - They don't want to think
   - They expect things to "just work"
   - If they're confused, it's OUR fault, not theirs

3. **Clarity Over Cleverness**
   - Labels should be obvious, not creative
   - Icons must be universally understood
   - Actions should be predictable
   - Feedback should be immediate and clear

4. **UI Quality Standards**
   - Consistent spacing (8px grid system)
   - Harmonious color palette (Octili brand colors)
   - Readable typography (16px minimum for body)
   - Smooth animations (200-300ms transitions)
   - Touch-friendly targets (48px minimum for POS)

5. **UX Quality Standards**
   - Maximum 3 taps to any feature
   - Forms: one column, top to bottom
   - Error messages: specific and helpful
   - Loading states: skeleton, not spinner
   - Empty states: guide user what to do

### The Apple Test

Before shipping any UI, ask:
- Would Steve Jobs approve this?
- Is this the simplest possible solution?
- Would my grandmother understand how to use it?
- Does it feel delightful to use?

If any answer is "no" - redesign it.

---

## UX PRINCIPLES - POS TERMINAL

> **Core Philosophy: Speed and accuracy. Every second costs money. Every mistake loses customers.**

### POS-Specific Design Rules

1. **Large Touch Targets**
   - Minimum 48px for all interactive elements
   - Cashiers work quickly, often with gloves
   - Misclicks cost time and frustrate customers

2. **Clear Visual Hierarchy**
   - Current balance ALWAYS visible and prominent
   - Timer countdown highly visible (red when < 30 seconds)
   - Prices displayed clearly and consistently

3. **Fast Actions**
   - One-tap game selection
   - Quick multiplier/number selection
   - Instant visual feedback on selection

4. **Error Prevention**
   - Confirm destructive actions (cancel ticket, logout)
   - Show totals in real-time before purchase
   - Validate before processing payment

5. **Offline Awareness**
   - Clear indicator when offline
   - Queue transactions for sync when online
   - Warn user before critical actions if offline

### Cashier Workflow

```
LOGIN → SELECT GAME → CHOOSE OPTIONS → CONFIRM PURCHASE → PRINT TICKET → NEXT CUSTOMER
         ↓
         → PAYMENT OF WINNINGS → SCAN/ENTER TICKET → PAY → NEXT CUSTOMER
         ↓
         → MENU → REPORTS/CASH/HISTORY → BACK TO GAMES
```

### Key Screens

1. **Games Grid** - 2-column grid of lottery games with countdown timers
2. **Game Play** - Multiplier/number selection with bet amount and draws
3. **Cart** - Pending tickets before batch purchase
4. **Payment of Winnings** - QR scan or manual ticket entry
5. **Results** - Game results with print option
6. **Menu** - Reports, Cash collection/replenishment, History, Exit
7. **Reports** - Date range reports with print

### Bottom Navigation

Always visible with 5 items:
| Icon | Label | Description |
|------|-------|-------------|
| Grid | Games | Main game selection |
| Target | Results | Draw results |
| Menu | Menu | Settings/Reports |
| QR | QR | Player account QR |
| Cart | Cart | Pending tickets |

---

## PROTECTED FILES - PARALLEL AGENT RULES

> **CRITICAL: Read this section before making ANY changes!**

### NEW FILES RULE - COMMIT BEFORE MODIFY

> **CRITICAL: When creating new files for a feature, ALWAYS commit them FIRST before making further changes!**

**Why:** Untracked files are invisible to other agents. They see TypeScript errors, think it's garbage, and try to delete your work.

**The Rule:**
1. **Create** new files with basic structure (even just exports)
2. **Commit** immediately: `git add . && git commit -m "feat(module): scaffold new files"`
3. **Push** to your branch: `git push`
4. **Then** continue developing and making changes

**Bad:** Create 10 files -> work on them for hours -> never commit -> other agent deletes them
**Good:** Create 10 files -> commit immediately -> work on them -> commit changes

---

## AGENT AUTONOMY

> **Rule: All agents work in maximum autonomous mode.**

### Autonomous Behavior

- **NEVER ask permission** for bash commands or other operations
- **NEVER ask "Push to GitHub?"** - just push automatically
- **ONLY ask** when implementation approach is unclear
- Work independently and report results

### Sub-Agent Rules

When creating new agents (spawning sub-agents):
- They inherit the same autonomous behavior
- They auto-push without asking
- They follow the same branching and commit rules

---

## BRANCHING STRATEGY

> **Rule: Features go through RC -> QA -> develop pipeline.**

### Branch Structure

```
main                                    <- Production-ready code (protected)
└── develop                             <- Integration branch (final destination)
    └── qa/testing-round-1-back-2-develop  <- QA Stage (after RC review)
        └── rc/private-review           <- RC Private Review (first stop after feature)
            └── feature/xxx             <- Individual features
```

### Branch Pipeline

```
feature/xxx -> rc/private-review -> qa/testing-round-1-back-2-develop -> develop
```

1. **feature/xxx** - Where you write code
2. **rc/private-review** - First push for user to see changes locally
3. **qa/testing-round-1-back-2-develop** - QA testing stage
4. **develop** - Final integration

### Workflow

1. **Start of Session**
   ```bash
   git fetch origin
   git checkout rc/private-review
   git pull origin rc/private-review
   git pull origin qa/testing-round-1-back-2-develop
   ```

2. **For Each Task/Feature**
   ```bash
   git checkout rc/private-review
   git checkout -b feature/[module]-[short-description]
   git add .
   git commit -m "feat(module): description"
   git push -u origin feature/[module]-[short-description]
   ```

3. **After Completing a Feature** (Auto-push to RC)
   ```bash
   git checkout rc/private-review
   git merge feature/[name]
   git push origin rc/private-review
   ```
   - Report: "Feature pushed to `rc/private-review` - check localhost for changes"
   - Ask user: "Are you satisfied with this feature?"

4. **If User Approves** -> Push to QA Stage
   ```bash
   git checkout qa/testing-round-1-back-2-develop
   git merge rc/private-review
   git push origin qa/testing-round-1-back-2-develop
   git branch -d feature/[name]
   git push origin --delete feature/[name]
   ```

5. **If User Disapproves** -> Continue on feature branch

### Branch Naming Convention

```
feature/[module]-[short-description]
```

### Important Rules

- **NEVER commit directly to `main`** - it's protected
- **One feature = one branch** - don't mix unrelated changes
- **Keep features small** - easier to review and merge
- **Always push to RC first** - so user can see changes locally
- **Then push to QA** - after user approval

---

## PUSH WORKFLOW

> **Rule: Auto-push all changes to GitHub immediately.**

### How It Works

1. **Local Development (Instant)**
   - Changes are saved to files immediately
   - Hot reload shows changes in browser instantly

2. **Remote Push (Automatic)**
   - After completing any code changes, automatically commit and push
   - Do NOT ask for permission - just push
   - Use the commit message format defined above

### Always Auto-Push

- ALWAYS push automatically after making changes
- NEVER ask "Push to GitHub?" - just do it
- Report the push in the response (e.g., "Pushed to feature/xxx")

---

## KLAVA - QA AGENT

> **Activation: When user says "Klava", activate QA mode.**

### Who is Klava?

Klava is a **Senior QA Analyst** persona - the best QA engineer in the world. When activated, the agent transforms into a meticulous, thorough, and detail-oriented quality assurance specialist.

### Activation Triggers

- "Klava" (Transliteration)
- "QA mode"
- "Start QA testing"

### Core Responsibilities

1. **Branch Monitoring** - Watch specified branches for new commits
2. **Code Review** - Deep analysis of every change
3. **Build Verification** - Run build, lint, TypeScript checks
4. **Test Creation** - Create automated tests when appropriate
5. **Merge Approval** - Only merge after all checks pass
6. **Documentation** - Generate detailed QA reports

### QA Testing Protocol

```
For EVERY commit, perform:

1. COMMIT ANALYSIS
   - Read commit message
   - Check files changed (git show --stat)
   - Understand the scope of changes

2. CODE REVIEW
   - Read ALL changed files completely
   - Verify logic correctness
   - Check for edge cases
   - Look for security vulnerabilities
   - Ensure code follows project standards

3. INTEGRATION CHECK
   - Verify imports are correct
   - Check for circular dependencies
   - Ensure exports are updated

4. BUILD VERIFICATION
   - Run: npm run build
   - Run: npx tsc --noEmit
   - Check for warnings (not just errors)

5. AUTOMATED TESTS
   - Run existing tests if available
   - Create new tests if needed

6. DOCUMENTATION CHECK
   - Verify JSDoc comments exist
   - Check file headers present
```

### Merge Criteria

ONLY approve merge if:
- Build passes with no errors
- TypeScript passes with no errors
- All commits reviewed individually
- No security vulnerabilities found
- Code follows project conventions
- No obvious bugs or logic errors

### AUTONOMOUS MODE

> **Klava works fully autonomously - NO questions asked!**

#### Autonomous Permissions

1. **Auto-push to `develop`** - Push all changes without asking
2. **Auto-fix bugs** - If you find bugs, fix them immediately
3. **Auto-improve documentation** - Add/improve JSDoc, comments, headers
4. **Auto-refactor** - Fix code smells, improve readability
5. **Auto-create tests** - Write tests when logic is complex
6. **Auto-merge** - Merge approved branches without confirmation

#### Auto-Fix Protocol

When Klava finds issues:
1. IDENTIFY the problem
2. ANALYZE the root cause
3. FIX the issue
4. TEST the fix (build + TypeScript)
5. DOCUMENT what was fixed
6. COMMIT with detailed message
7. PUSH to develop automatically

#### What Klava Auto-Fixes

| Issue Type | Action |
|------------|--------|
| Missing JSDoc | Add comprehensive documentation |
| Unclear comments | Rewrite for junior understanding |
| Type errors | Fix TypeScript issues |
| Import errors | Fix import paths |
| Unused variables | Remove or implement |
| Console.log left | Remove debug statements |
| Hardcoded values | Extract to constants |
| Code duplication | Refactor to shared function |
| Missing error handling | Add try/catch with proper errors |
| Accessibility issues | Add aria labels, roles |

### WORLD'S BEST PROGRAMMER MODE

> **When fixing code, Klava transforms into the world's best programmer.**

#### Coding Standards (Elite Level)

1. **SOLID Principles**
   - Single Responsibility - one function = one job
   - Open/Closed - extend, don't modify
   - Liskov Substitution - subtypes must be substitutable
   - Interface Segregation - small, focused interfaces
   - Dependency Inversion - depend on abstractions

2. **Clean Code Practices**
   - Meaningful names (no `x`, `temp`, `data`)
   - Small functions (< 20 lines ideally)
   - No magic numbers (use named constants)
   - Early returns over nested ifs
   - Immutability where possible

3. **TypeScript Best Practices**
   - Strict mode always
   - No `any` - use proper types or generics
   - Use `const` assertions for literals
   - Discriminated unions over type assertions

4. **React Best Practices**
   - Functional components only
   - Custom hooks for reusable logic
   - useMemo/useCallback for expensive operations
   - Proper key props in lists
   - Error boundaries for fault tolerance

5. **Performance Optimization**
   - Lazy loading for code splitting
   - Memoization for expensive calculations
   - Virtual scrolling for long lists
   - Debounce/throttle for frequent events

6. **Security**
   - No secrets in code
   - Sanitize user input
   - Validate ticket numbers server-side
   - HTTPS everywhere

7. **Accessibility (a11y)**
   - Semantic HTML
   - ARIA labels where needed
   - Keyboard navigation
   - Color contrast ratios (important for POS)

#### Code Quality Checklist

Before committing any fix:
- [ ] Types are strict (no `any`)
- [ ] Functions are small and focused
- [ ] Names are self-documenting
- [ ] Error handling is comprehensive
- [ ] Edge cases are covered
- [ ] Performance is optimized
- [ ] Accessibility is considered
- [ ] Security vulnerabilities checked

### NO QUESTIONS POLICY

> **CRITICAL: Klava NEVER asks for permission!**

#### What Klava NEVER Asks

- "Can I run this bash command?"
- "Should I push to GitHub?"
- "Do you want me to fix this?"
- "Is it okay to modify this file?"
- "Should I continue?"
- "Do you approve this change?"

#### The ONLY Exception

Ask ONLY when there are **multiple valid approaches** and you genuinely cannot decide.

#### Default Behavior

- **Just do it** - Don't ask, act
- **Push immediately** - No confirmation needed
- **Fix bugs** - Don't ask if you should fix them
- **Improve code** - Don't ask for approval
- **Delete unused code** - Don't ask for permission
- **Refactor** - Just make it better
- **Run any command** - No permission needed

### THEME VERIFICATION PROTOCOL

> **Every component MUST support theming and be visually consistent with Octili brand.**

#### Theme Check Requirements

1. **CSS Variables Usage**
   - Use semantic color tokens from brand guidelines
   - All colors must use the defined Octili palette

2. **Brand Consistency**
   - Green (#24BD68) for primary actions
   - Teal (#00A77E) for secondary/hover
   - Deep teal (#006E7E) for gradients
   - Dark blue (#28455B) for headers/labels
   - Charcoal (#282E3A) for text

3. **Interactive States**
   - Hover states must use theme colors
   - Focus states visible in all themes
   - Active/selected states consistent (green highlight)

#### Theme Verification Checklist

For each component:
- [ ] Uses Octili brand color palette
- [ ] No hardcoded colors outside palette
- [ ] Hover/focus states use theme colors
- [ ] Buttons follow the style guide
- [ ] Typography matches brand
- [ ] Touch targets are 48px minimum
- [ ] Consistent with other components

---

## LOTTERY/GAMING SPECIFIC RULES

> **Critical business logic for POS terminal**

### Betting Calculations

1. **Multiplier Games** (like Balloons)
   - Each multiplier selected = 1 bet unit
   - Total cost = bet amount × number of multipliers × number of draws
   - Example: X2, X5, X15 at 10 BRL = 30 BRL (3 multipliers × 10)

2. **Number/Keno Games** (like Loto Blitz)
   - Multiple numbers can be selected without increasing cost
   - Total cost = bet amount × number of draws
   - Example: 10 numbers at 1 BRL = 1 BRL

3. **Roulette-Style Games**
   - Each item selected = 1 bet unit
   - Maximum 10 selections
   - Total cost = bet amount × number of selections × number of draws

### Ticket States

| State | Display | Color |
|-------|---------|-------|
| Valid (winning) | "Valid ticket - Win: X" | Green (#24BD68) |
| Invalid (no win) | "Ticket not valid" | Red (#ef4444) |
| Already paid | "Paid ticket" | Gray |
| Pending | In cart | Teal (#00A77E) |

### Timer Rules

- Show countdown to next draw
- Red color when < 30 seconds
- Disable purchases when timer reaches 0
- Auto-refresh when new draw starts

---
