# AI Feature Implementation Plan

## Initial Plan Prompt

Analyze the existing Next.js App Router + TypeScript Pokemon application and create an implementation plan for the "Explain This Item with AI" feature.

The feature must satisfy these requirements:

1. Secure Gemini integration:
- Use the official @google/genai SDK.
- Use GEMINI_MODEL with gemini-3.6-flash as the default.
- Read GEMINI_API_KEY only on the server.
- Use a Server Action, Route Handler, or server-only service.
- Never call Gemini directly from client components.
- Validate server input.
- Return only the explanation or a safe application-level error.
- Never expose SDK internals or secrets.

2. UI:
- Add a localized "Explain this item with AI" button to the existing item details view.
- The request must only start after an explicit click.
- Show pending, success, retry and regenerate states.
- Prevent duplicate requests while pending.
- Display the explanation in the active locale.
- Display a visible warning that the result is AI-generated and may be inaccurate.
- Reuse the result for the same item and locale until explicitly regenerated.

3. Prompt/context:
- Create a dedicated context/prompt builder.
- Allowlist no more than 12 useful Pokemon properties.
- Do not send the complete Pokemon API response.
- Limit serialized context to 4 KB.
- Tell Gemini that item data is untrusted data, not instructions.
- Request a beginner-friendly explanation in the active locale.
- Use only supplied facts.
- Limit the response to 512 output tokens.

4. Error handling:
- Handle missing API key, authentication errors, 429/rate limits, blocked responses, empty responses and unexpected errors.
- Return safe localized errors.
- Never expose stack traces, prompts, SDK responses or secrets.

5. Tests:
- Test the prompt/context builder including allowlisting and untrusted/oversized input.
- Test successful and failed Gemini calls using mocks.
- Test UI pending/disabled state.
- Test successful explanation and recoverable error.
- Tests must never call the real Gemini API and must not require an API key.

Also inspect the existing next-intl setup, Pokemon detail component, data types, service layer, testing setup and project scripts before proposing the plan.

Do not modify files yet.

## Initial Plan

Problem
- Add an "Explain this item with AI" feature to the Next.js + TypeScript Pokemon app using the official @google/genai SDK (server-only Gemini integration). The feature must be secure, localized, tested, and provide a reliable UX with caching and regeneration.

Approach
- Server: implement a server-only service (Route Handler or Server Action) that reads GEMINI_API_KEY from server env only, validates input, builds a sanitized prompt/context (allowlist up to 12 props, <=4KB), calls @google/genai with gemini-3.6-flash, constrains output to 512 tokens, and returns only the explanation or a safe error message.
- Prompt builder: create a dedicated module responsible for allowlisting properties, serializing limited context, marking item data as untrusted, and producing a localized, beginner-friendly prompt. Include unit tests for edge cases (oversized input, disallowed fields).
- UI: add a localized "Explain this item with AI" button in the existing item detail view. Button triggers the server call only after explicit click. Show pending, success, retry, regenerate states; prevent duplicate requests; display explanation in active locale and a visible AI-generated warning. Reuse cached result for same item+locale until user regenerates.
- Caching: implement a server-side cache keyed by item-id + locale + schema-hash (or timestamp). Cache may be in-memory with an optional simple persistent layer (file/DB) depending on existing infra. Cache must be invalidated on explicit regenerate.
- Error handling: map Gemini and network errors to safe, localized application-level errors. Handle missing API key, auth errors, 429, blocked responses, empty or malformed responses, and unexpected errors. Never leak prompts, SDK internals, stack traces, or secrets.
- Tests: unit tests for prompt builder, mocked Gemini calls for success/failure, UI tests for pending/disabled states and success/recoverable errors. Tests must not call real Gemini API and must not require an API key.

Files / Components to inspect/change
- src/components/pokemonCard/ (item detail component)
- src/app or src/pages route for item details
- src/services/ (service layer where external API calls live)
- src/i18n or next-intl config (localization)
- src/lib or src/utils for new prompt builder and cache modules
- tests/ or __tests__ for unit and integration tests
- package.json scripts (test) and existing test setup (jest/vitest/playwright)

Key decisions / trade-offs
- Use a server-only Route Handler or Server Action (preferred: Route Handler for explicit API semantics). This satisfies the "server-only" requirement and keeps client free of secrets.
- Cache on the server to avoid re-calls and to centralize regeneration handling. Keep initial implementation in-memory to reduce scope; allow later persistence if needed.
- Limit context and prompt strictly to reduce cost and risk; do not send raw API response.

Todos (for tracking)
- ai-explain-feature-plan: Writing implementation plan and task breakdown (this file)
- ai-explain-server: Implement server service (Route Handler) for Gemini calls, env validation and safe responses
- ai-explain-prompt-builder: Implement prompt/context builder with allowlist, size limit and localization
- ai-explain-ui: Add localized button, UI states, warning, and integrate with service
- ai-explain-caching: Add server-side cache and regeneration endpoint/flag
- ai-explain-errors: Implement safe localized error mapping and logging (server-only)
- ai-explain-tests: Add unit tests and mocks to cover prompt builder, server calls and UI states
- ai-explain-integration: Test end-to-end behavior locally with mocks and run test suite

Notes / Next steps
- Inspect next-intl setup, Pokemon detail component, data types, service layer and test runner to select exact file paths and test harness before implementing.
- After user approval, implement in small commits with targeted tests.

## My Review and Refinements

Refine the plan based on the actual repository instead of hypothetical paths.

Before finalizing the plan, inspect the relevant existing files and patterns in the codebase, especially:

* the existing Pokemon detail component and how the selected Pokemon data reaches it;
* the Pokemon TypeScript types and the public API service;
* the existing Server Action implementation, especially `src/app/actions/exportPokemonsCsv.ts`;
* the existing next-intl routing and message structure;
* the existing testing framework, test configuration and representative component/unit tests;
* package.json scripts;
* any existing caching or data-fetching mechanisms.

Then revise the plan using the actual file paths and existing architectural patterns.

Important decisions to reconsider:

1. Compare Server Action vs Route Handler specifically in the context of this project. Since the project already uses Server Actions, prefer reusing that pattern unless there is a concrete reason why a Route Handler is technically better. Explain the reason.

2. Do not introduce a persistent cache, database, file storage, or other infrastructure unless the existing project already has an appropriate mechanism. Propose the simplest implementation that satisfies:

   * reuse result for the same Pokemon + locale;
   * no new Gemini request when a cached result exists;
   * explicit regeneration bypasses/replaces the cached result.

3. Do not invent directories or filenames. Every proposed file path should correspond to an existing project convention or be clearly identified as a new file.

4. Keep the architecture minimal and appropriate for this course task. Avoid optional infrastructure that is not required by the acceptance criteria.

5. Explicitly describe the data flow from the Pokemon detail UI to the server-side Gemini call and back to the UI.

6. Explicitly identify which implementation step would be meaningful to delegate to Copilot Agent mode.

Return a revised, repository-specific implementation plan with:

* actual files to inspect/change/create;
* responsibilities of each file;
* data flow;
* caching strategy;
* error handling strategy;
* testing strategy;
* meaningful Agent-mode implementation step;
* any remaining decisions that require my approval.

Do not modify files yet.

## Agent Implementation Step


Problem
- Add an "Explain this item with AI" feature to this Next.js (App Router) + TypeScript Pokemon app using the official @google/genai SDK (server-only Gemini integration). The feature must be secure (server-only key), localized with next-intl, tested (no real Gemini calls), and provide a clear UX with pending/success/retry/regenerate states and caching per pokemon+locale.

Why this repo matters
- The codebase already uses Server Actions for server-side functionality (see src/app/actions/exportPokemonsCsv.ts) and next-intl for localization. Tests use vitest + msw. Conventions discovered in the repo inform the design below.

High-level approach (repository-aware)
- Server action: implement a server-only Server Action in src/app/actions/explainPokemon.ts that accepts a FormData payload (pokemon id, regenerate flag, locale) and returns only a small state object containing either the explanation text or a safe error key. It will read GEMINI_API_KEY only on server and use @google/genai with GEMINI_MODEL defaulting to gemini-3.6-flash.
  - Rationale: this project already uses Server Actions (exportPokemonsCsv) and the client-side useActionState helper; reusing this pattern keeps the integration consistent and avoids creating a separate Route Handler unless a concrete need for an independent HTTP API emerges.

- Prompt/context builder: new module src/lib/explainPrompt.ts that
  - Allowlists up to 12 useful Pokemon fields (exact set configurable; proposal: id, name, types, height, weight, abilities, stats (flattened top N), sprites presence flags, soundUrl presence) — requires final approval on exact fields.
  - Serializes the selected facts to JSON with a strict <=4096 byte limit; if serialized size exceeds the limit, reduce / trim least useful fields deterministically.
  - Marks the item data in the prompt as "untrusted data" (explicit instruction to Gemini not to treat as system instruction).
  - Builds a localized human-readable prompt instructing Gemini to provide a beginner-friendly explanation in the requested locale and to use only the supplied facts.
  - Enforces the response token limit (request max output tokens 512) via the SDK call parameters.

- Server cache: new in-memory cache module src/lib/explainCache.ts
  - Key: `${id}:${locale}`. Value: { explanation: string, createdAt: number }.
  - Initial policy: no persistent storage, TTL 24 hours (configurable). Regeneration bypasses and replaces cached entry.
  - Rationale: the repository has no existing persistent cache infra; in-memory is minimal and satisfies the acceptance criteria (reuse until regenerate) without adding infra.

- UI: client component + integration
  - New client component: src/components/pokemonDetail/ExplainWithAI.tsx ("use client"). Responsibilities:
    - Render a localized button text (via next-intl useTranslations) "Explain this item with AI" and an attached form using useActionState bound to the server action explainPokemon (same pattern as Flyout -> exportPokemonsCsv).
    - Include hidden inputs: id, locale (from useLocale), regenerate flag when user clicks "Regenerate".
    - Disable the primary action while pending; show pending state using isPending.
    - Present result area with AI-warning banner (localized) and regenerate / retry controls.
    - Prevent duplicate requests while pending by disabling actions.
  - Integrate in server component: src/components/pokemonDetail/PokemonDetail.tsx — import and render <ExplainWithAI id={details.id} /> inside the detail view (PokemonDetail is a server component; it already renders on the server and can include the client ExplainWithAI component without exposing secrets).

Repository-specific files to inspect / change / create
- Existing (inspect):
  - src/app/actions/exportPokemonsCsv.ts (example Server Action usage and pattern)
  - src/components/pokemonDetail/PokemonDetail.tsx (where the explain UI will appear)
  - src/services/pokemonService.ts (to fetch the Pokemon details server-side)
  - src/types.ts (Pokemon and PokemonDetails shapes)
  - src/mocks/* (msw handlers + server.ts) and src/services/pokemonService.test.ts (test patterns)
  - messages/en.json (add localization keys)

- New files to add (clear, minimal locations that fit the project structure):
  - src/app/actions/explainPokemon.ts (Server Action — server-only, 'use server')
  - src/lib/explainState.ts (shared client/server state types and initial state like exportCsvState uses)
  - src/lib/explainPrompt.ts (prompt/context builder and allowlist + serializer)
  - src/lib/explainCache.ts (in-memory cache keyed by id+locale with TTL and regenerate support)
  - src/components/pokemonDetail/ExplainWithAI.tsx (client component with useActionState)

- Tests to add (matching existing patterns):
  - src/lib/explainPrompt.test.ts (unit tests: allowlisting, trimming/oversized input, serialization limits)
  - src/app/actions/explainPokemon.test.ts (unit tests for server action: successful path and error mapping; mock @google/genai SDK and pokemonService.getById)
  - src/components/pokemonDetail/ExplainWithAI.test.tsx (component tests: pending/disabled state, success and recoverable error flows; mock useActionState invocation and server action)

Data flow (step-by-step)
1. User opens search page; PokemonDetail is rendered server-side with detailed Pokemon data fetched via pokemonService.getById(id).
2. PokemonDetail (server component) includes the ExplainWithAI client component.
3. ExplainWithAI (client) reads the current locale using useLocale() and renders a form that is wired to the server action explainPokemon using useActionState(explainPokemon, initialExplainState).
4. On explicit click, the client submits FormData { id, locale, regenerate } to the server action.
5. Server action explainPokemon: validate inputs (id numeric, locale in routing.locales, regenerate boolean). If invalid, return { status: 'error', error: 'invalidRequest' }.
6. If regenerate is false, check src/lib/explainCache for an existing entry for `${id}:${locale}`; if present, return it as success.
7. Otherwise, server action calls pokemonService.getById(id) to get the PokemonDetails server-side.
8. Build the prompt/context using src/lib/explainPrompt.ts — allowlist fields and serialize (<=4KB). If we need to trim fields to meet size, do so deterministically.
9. Instantiate @google/genai client on the server (read GEMINI_API_KEY from process.env), call the model gemini-3.6-flash, request max output tokens 512 and pass the prompt + serialized context. Use robust try/catch and only surface safe messages back to the client.
10. On a successful reply, persist into explainCache and return { status: 'success', explanation }.
11. On error, map the error type to a localized error key (missing api key → 'explainMissingApiKey'; 401 → 'explainAuth'; 429 → 'explainRateLimit'; blocked content → 'explainBlocked'; empty output → 'explainEmpty'; fallback → 'Errors.generic') and return { status: 'error', error: <key> }.

Caching strategy (minimal, repo-appropriate)
- Implementation: src/lib/explainCache.ts — a small Map<string, { explanation:string; createdAt:number }>
- Key: `${id}:${locale}`; TTL default: 24 hours (configurable via environment var or module constant)
- Regeneration: client sends regenerate=true; server action will bypass cache and replace the cached value on success
- Memory-only: no database or file storage; aligns with repo simplicity and avoids new infra
- Invalidation: explicit regenerate button in UI; a future improvement could add a server endpoint to clear cache but not required now

Error handling (safe, localized)
- Never return SDK internals, prompts, or stack traces to the client. Log server-side with console.error for operator debugging.
- Map known failure modes to message keys (store them in messages/en.json):
  - explainMissingApiKey -> "Gemini API key is not configured"
  - explainAuth -> "Authentication failed"
  - explainRateLimit -> "Rate limit exceeded, try again later"
  - explainBlocked -> "The request was blocked by the model" (safe recoverable)
  - explainEmpty -> "No explanation returned, please try again"
  - explainInvalidInput -> "Invalid request data"
  - fallback -> use existing Errors.generic
- Tests must assert that these keys are returned by the server action and that the UI displays localized messages using next-intl. The actual English/Russian user-facing strings will be added to messages/*.json.

Testing strategy (no real Gemini calls)
- Unit test prompt builder (src/lib/explainPrompt.test.ts): verify allowlist, trimming logic, and serialization length enforcement.
- Server action tests (src/app/actions/explainPokemon.test.ts): import explainPokemon and mock dependencies:
  - Mock pokemonService.getById to return controlled PokemonDetails
  - Mock @google/genai client and model call to return a fake response or throw specific errors (simulate 401, 429, blocked, empty)
  - Assert the server action returns the correct success or error state and that cached paths behave as expected
- Client tests (src/components/pokemonDetail/ExplainWithAI.test.tsx): render the component, mock useActionState/explainPokemon binding or run in-environment using the actual useActionState hook but mock server action with vitest (preferred).
- Use vitest + msw patterns already present in repo; tests must not require GEMINI_API_KEY and must not call the real @google/genai API.

Agent-mode delegation (meaningful step)
- Delegate the initial implementation of the prompt/context builder and its unit tests to a background Copilot Agent. Reason: the prompt builder is a self-contained module with clear inputs/outputs and many deterministic unit tests (allowlist trimming, size enforcement). Running this in Agent mode speeds up iterations while the main author focuses on server action integration and UI wiring.

Remaining decisions that need approval before implementation
1. Exact allowlist of up to 12 Pokemon properties (proposal included above). Confirm or provide a finalized list.
2. Cache TTL (propose 24 hours). Accept or suggest alternate TTL.
3. Message keys and the textual copy for the AI-warning banner and error messages (I will add keys to messages/en.json and messages/ru.json; please confirm phrasing or approve adding sensible defaults).
4. Whether to store the cache key with a schema hash (e.g., if the allowed fields change and old cached values should be invalidated). Current proposal: simple id:locale key; if you prefer schema-hash invalidation, approve adding a deterministic hash of the allowed fields to the cache key.

Next steps after approval
- Implement in this order (small commits):
  1. Add shared state type (src/lib/explainState.ts) and prompt builder (src/lib/explainPrompt.ts) + unit tests.
  2. Implement server action src/app/actions/explainPokemon.ts with robust error mapping and caching; add server-side tests mocking @google/genai.
  3. Add client component src/components/pokemonDetail/ExplainWithAI.tsx and update PokemonDetail.tsx to render it; add component tests.
  4. Add localized message keys to messages/*.json.
  5. Run targeted test files with vitest and iterate until green.

If this plan looks good, approve and implementation will start against the repository using the project conventions (small commits, tests first where appropriate).

## Generated Changes

The prompt/context builder and its unit tests were delegated to Copilot Agent mode.

The Agent was instructed to:
- inspect the existing PokemonDetails type and Vitest conventions;
- create `src/lib/explainPrompt.ts`;
- create `src/lib/explainPrompt.test.ts`;
- implement the exact 12-field allowlist;
- flatten Pokemon stats;
- enforce the 4096-byte UTF-8 limit;
- implement deterministic trimming;
- mark Pokemon data as untrusted;
- generate a localized beginner-friendly prompt;
- add deterministic unit tests.

The generated implementation was manually reviewed and the tests were refined to explicitly verify locale, beginner-friendly/factual instructions, and exclusion of unrelated API fields.