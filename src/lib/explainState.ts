/**
 * Shared types for the Explain-with-AI Server Action and client useActionState
 */

export type ExplainErrorKey =
  | 'explainMissingApiKey'
  | 'explainAuth'
  | 'explainRateLimit'
  | 'explainBlocked'
  | 'explainEmpty'
  | 'explainInvalidInput'
  | 'explainGeneric';

export type ExplainState =
  | { status: 'idle' }
  | { status: 'success'; explanation: string }
  | { status: 'error'; error: ExplainErrorKey };

export const initialExplainState: ExplainState = { status: 'idle' };
