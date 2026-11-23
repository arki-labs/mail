/**
 * How every transport turns what a service said into a failure. One mapping, so failover and
 * the journal runner see the same `retryable` and the same kind whichever service failed.
 */
import type { Result } from '@arki/failure';
import type { MailMessage, RecipientOutcome, SentMail, TransportFailure } from './types.js';
/**
 * The service answered with an error status. 429 and 5xx can pass on a later try; any other
 * status means the request itself is wrong and will fail again.
 */
export declare function rejection(transport: string, status: number, detail?: {
    readonly message?: string;
    readonly providerCode?: string;
    readonly retryAfterMs?: number;
}): import("@arki/failure").Failure<"mail.rejected", {
    transport: string;
    retryable: boolean;
    upstreamStatus?: number | undefined;
    providerCode?: string | undefined;
    detail?: string | undefined;
    retryAfterMs?: number | undefined;
}>;
/** The longest a request may wait for the service, in milliseconds, when the transport sets no `timeoutMs`. */
export declare const DEFAULT_TIMEOUT_MS = 30000;
/** The longest `timeoutMs` a transport takes: the largest delay a runtime timer holds (2^31 - 1 ms, about 24.8 days). */
export declare const MAX_TIMEOUT_MS = 2147483647;
/**
 * Checks a transport's `timeoutMs` when the transport is built, so a bad value fails at boot as `MailError`
 * (`ARKI_MAIL_E001`) instead of making every send reject with a raw `TypeError` or `RangeError`.
 */
export declare function checkTimeoutMs(transport: string, timeoutMs: number | undefined): void;
/**
 * Checks a value the transport sends in an HTTP header (an API key, a token, an AWS key id) when the
 * transport is built. `fetch` refuses a line break, a NUL character or a character above U+00FF before
 * anything is sent, so such a value would make every send `MailUncertain` although no mail went out.
 * It fails at boot as `MailError` (`ARKI_MAIL_E001`) instead. The value is never echoed: it is a secret.
 */
export declare function checkHeaderValue(transport: string, option: string, value: string): void;
/**
 * The signal one request runs under: the caller's `signal` joined with a timeout. After a failure,
 * `reason()` says which of them ended it, so a caller's cancel is not reported as an outage.
 */
export declare function requestSignal(caller: AbortSignal | undefined, timeoutMs?: number): {
    signal: AbortSignal;
    reason: () => 'cancelled' | 'timeout' | 'network';
};
/** Milliseconds to wait from a `Retry-After` header (whole seconds or an HTTP date), or `undefined`. */
export declare function retryAfterMs(header: string | null | undefined): number | undefined;
/**
 * The request failed in transit, timed out or was aborted (`reason` says which). The service may
 * have taken the mail.
 */
export declare function uncertain(transport: string, error: unknown, reason: 'cancelled' | 'timeout' | 'network'): import("@arki/failure").Failure<"mail.uncertain", {
    transport: string;
    detail: string;
    upstreamStatus?: number | undefined;
    reason?: "cancelled" | "network" | "timeout" | "unreadable" | undefined;
}>;
/** The service answered with success, but the answer could not be read. It may have taken the mail. */
export declare function badResponse(transport: string, status: number, problem: string): import("@arki/failure").Failure<"mail.uncertain", {
    transport: string;
    detail: string;
    upstreamStatus?: number | undefined;
    reason?: "cancelled" | "network" | "timeout" | "unreadable" | undefined;
}>;
/** A field this transport cannot carry. Thrown before any request, so nothing was sent. */
export declare function unsupported(transport: string, problem: string): never;
/** Every recipient of `message`, with one status. */
export declare function everyRecipient(message: MailMessage, status: RecipientOutcome['status']): readonly RecipientOutcome[];
/** Logs the outcome of one send at debug level and returns it unchanged. */
export declare function logged(transport: string, result: Result<SentMail, TransportFailure>): Result<SentMail, TransportFailure>;
//# sourceMappingURL=transport-failures.d.ts.map