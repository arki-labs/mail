/**
 * Checks on a message before any transport sees it. A line break in a header or an address
 * would let input add headers of its own (header injection), so it is refused, not cleaned.
 */
import type { FailureOf } from '@arki/failure';
import type { Addresses, MailMessage } from './types.js';
import { MailInvalidMessage } from './failures.js';
/** Addresses as a list; `undefined` is an empty list. */
export declare function listOf(addresses: Addresses | undefined): readonly string[];
/**
 * The first problem with `message`, as `MailInvalidMessage`, or `undefined` when it can be sent.
 * Addresses usually come from a user, so a bad one is an expected outcome, returned not thrown.
 */
export declare function checkMessage(message: MailMessage): FailureOf<typeof MailInvalidMessage> | undefined;
/**
 * Staging guard: every mail goes to `redirectTo` instead. Cc and Bcc are dropped so no real
 * person is copied; the original To is kept in `X-Original-To` for debugging.
 */
export declare function redirect(message: MailMessage, redirectTo: Addresses): MailMessage;
//# sourceMappingURL=message.d.ts.map