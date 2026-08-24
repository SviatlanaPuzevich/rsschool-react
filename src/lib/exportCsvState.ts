/**
 * Shared state contract for the CSV export server action. It lives outside of
 * the `'use server'` module because such modules may only export async
 * functions.
 */

/** Message key of the `Flyout` namespace, translated on the client. */
export type ExportErrorKey = 'downloadFailed';

export type ExportCsvState =
  | { status: 'idle' }
  | { status: 'success'; csv: string; filename: string }
  | { status: 'error'; error: ExportErrorKey };

export const initialExportCsvState: ExportCsvState = { status: 'idle' };
