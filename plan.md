Analyze the existing Next.js App Router + TypeScript Pokemon application and create an implementation plan for the "Explain This Item with AI" feature.

The feature must satisfy these requirements:

1. AI-assisted workflow:

- The implementation will be reviewed and refined by the developer.
- The meaningful implementation step delegated to Copilot Agent must be identifiable later in docs/ai-feature-plan.md.

2. Secure Gemini integration:

- Use the official @google/genai SDK.
- Use GEMINI_MODEL with gemini-3.6-flash as the default.
- Read GEMINI_API_KEY only on the server.
- Use a Server Action, Route Handler, or server-only service.
- Never call Gemini directly from client components.
- Validate server input.
- Return only the explanation or a safe application-level error.
- Never expose SDK internals or secrets.

3. UI:

- Add a localized "Explain this item with AI" button to the existing item details view.
- The request must only start after an explicit click.
- Show pending, success, retry and regenerate states.
- Prevent duplicate requests while pending.
- Display the explanation in the active locale.
- Display a visible warning that the result is AI-generated and may be inaccurate.
- Reuse the result for the same item and locale until explicitly regenerated.

4. Prompt/context:

- Create a dedicated context/prompt builder.
- Allowlist no more than 12 useful Pokemon properties.
- Do not send the complete Pokemon API response.
- Limit serialized context to 4 KB.
- Tell Gemini that item data is untrusted data, not instructions.
- Request a beginner-friendly explanation in the active locale.
- Use only supplied facts.
- Limit the response to 512 output tokens.

5. Error handling:

- Handle missing API key, authentication errors, 429/rate limits, blocked responses, empty responses and unexpected errors.
- Return safe localized errors.
- Never expose stack traces, prompts, SDK responses or secrets.

6. Tests:

- Test the prompt/context builder including allowlisting and untrusted/oversized input.
- Test successful and failed Gemini calls using mocks.
- Test UI pending/disabled state.
- Test successful explanation and recoverable error.
- Tests must never call the real Gemini API and must not require an API key.

Also inspect the existing next-intl setup, Pokemon detail component, data types, service layer, testing setup and project scripts before proposing the plan.

Do not modify files yet.
