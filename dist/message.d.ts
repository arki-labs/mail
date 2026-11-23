/**
 * Checks on a message before any transport sees it. A line break in a header or an address
 * would let input add headers of its own (header injection), so it is refused, not cleaned.
 * A NUL character (U+0000) is refused too: no mail can carry it, and Postgres refuses it in the
 * outbox row (SQLSTATE 22P05), so `send` and `enqueue` agree. So is a lone surrogate (such as
 * `'\ud800'` alone): it is not text, UTF-8 cannot encode it, and the outbox's jsonb column
 * refuses its `\ud800` escape (SQLSTATE 22P02).
 */
import type { FailureOf } from '@arki/failure';
import type { Addresses, MailMessage } from './types.js';
import { MailInvalidMessage } from './failures.js';
/** Whether `fetch` would refuse `value` as an HTTP header value, before sending anything. */
export declare function unsendableInHeader(value: string): boolean;
/** Whether a key or a string anywhere in this value holds U+0000. */
export declare function holdsNul(value: unknown): boolean;
/** Whether a key or a string anywhere in this value holds a lone surrogate (such as `'\ud800'` alone). */
export declare function holdsLoneSurrogate(value: unknown): boolean;
/** Addresses as a list; `undefined` is an empty list. */
export declare function listOf(addresses: Addresses | undefined): readonly string[];
/**
 * The first problem with `message`, as `MailInvalidMessage`, or `undefined` when it can be sent.
 * Addresses usually come from a user, so a bad one is an expected outcome, returned not thrown.
 */
export declare function checkMessage(message: MailMessage): FailureOf<typeof MailInvalidMessage> | undefined;
/**
 * `MailInvalidMessage` when `idempotencyKey` cannot travel as an HTTP header (Resend sends it as
 * `Idempotency-Key`, and `failover` may pick Resend), or `undefined` when it can. Without this check
 * `fetch` refuses the request before sending and the send reads as `MailUncertain`.
 */
export declare function checkIdempotencyKey(key: string | undefined): FailureOf<typeof MailInvalidMessage> | undefined;
/**
 * Staging guard: every mail goes to `redirectTo` instead. Cc and Bcc are dropped so no real
 * person is copied; the original To is kept in `X-Original-To` for debugging.
 */
export declare function redirect(message: MailMessage, redirectTo: Addresses): MailMessage;
//# sourceMappingURL=message.d.ts.map