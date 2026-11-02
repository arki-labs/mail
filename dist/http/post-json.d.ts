/** One JSON POST, shared by the fetch transports. Never throws. */
import type { FailureOf } from '@arki/failure';
import type { MailUncertain } from '../failures.js';
export type FetchFn = typeof globalThis.fetch;
/**
 * What the service answered. `body` is `undefined` when it was empty or not JSON. `retryAfterMs` is
 * the service's `Retry-After`, when it sent one.
 */
export type JsonAnswer = {
    readonly status: number;
    readonly body: unknown;
    readonly retryAfterMs?: number;
};
/**
 * POSTs `body` as JSON. A request that fails in transit, times out (`timeoutMs`, default 30 s) or is
 * aborted, or whose answer cannot be read to the end, is `MailUncertain`: the service may have taken
 * the mail. Its `reason` tells a caller's cancel from a timeout and from a network fault.
 */
export declare function postJson(request: {
    readonly transport: string;
    readonly fetch: FetchFn;
    readonly url: string;
    readonly headers: Readonly<Record<string, string>>;
    readonly body: unknown;
    readonly signal?: AbortSignal;
    readonly timeoutMs?: number;
}): Promise<JsonAnswer | FailureOf<typeof MailUncertain>>;
//# sourceMappingURL=post-json.d.ts.map