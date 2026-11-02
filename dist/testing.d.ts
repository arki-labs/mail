/**
 * Test helpers. `mailSink()` is a transport that keeps every mail in memory; `transportContract`
 * is the suite every transport must pass (it imports vitest).
 *
 * @example
 * const sink = mailSink();
 * const mail = mailer({ transport: sink, from: 'App <hi@app.dev>' });
 * await signUp(mail, 'ada@example.com');
 * expect(sink.sentWith(verifyEmail)).toHaveLength(1);
 */
import type { StandardSchemaV1 } from '@arki/schema';
import type { MailTemplate } from './template.js';
import type { MailMessage, MailTransport, TransportFailure } from './types.js';
export type { TransportHarness } from './testing/transport-contract.js';
export { transportContract } from './testing/transport-contract.js';
/**
 * One mail the sink took. `template` is the template's name (`undefined` for `sendRaw`). The
 * template's input is not recorded: a transport only sees the rendered message.
 */
export type SentRecord<Name extends string | undefined = string | undefined> = {
    readonly message: MailMessage;
    readonly template: Name;
    readonly idempotencyKey: string | undefined;
};
export type MailSink = MailTransport & {
    /** Every mail taken, oldest first. Failed sends are not recorded. */
    readonly sent: readonly SentRecord[];
    /** Mails rendered from `template`. */
    sentWith<S extends StandardSchemaV1, Name extends string>(template: MailTemplate<S, Name>): readonly SentRecord<Name>[];
    /** Mails with `address` in To, Cc or Bcc. `Name <a@b>` matches `a@b`; case is ignored. */
    sentTo(address: string): readonly SentRecord[];
    /** The latest mail taken. */
    last(): SentRecord | undefined;
    /** The next send returns this failure (default: a `MailRejected` that is not retryable). Only the next one. */
    failNext(failure?: TransportFailure): void;
    /** Forgets every mail and any pending `failNext`. */
    clear(): void;
};
/** A transport that sends nothing and records each mail, reported as `simulated`. */
export declare function mailSink(): MailSink;
//# sourceMappingURL=testing.d.ts.map