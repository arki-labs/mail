/**
 * The mailer: renders a template, checks the message, hands it to one transport, and reports
 * what happened. A mail that is not sent is a returned failure; only misuse throws `MailError`.
 */
import type { FailureOf, Result } from '@arki/failure';
import type { SchemaInput, StandardSchemaV1 } from '@arki/schema';
import type { MailTemplate } from './template.js';
import type { Address, Addresses, Awaitable, MailContent, MailEvent, MailMessage, MailTransport, RenderContext, SendFailure, SendOptions, SendRawFailure, SentMail } from './types.js';
import type { MailInvalidMessage } from './failures.js';
import { renderTemplate } from './template.js';
export type MailerOptions = {
    readonly transport: MailTransport;
    /** The sender when neither the send nor the template names one. */
    readonly from: Address;
    /** Staging guard: every mail goes here instead; Cc and Bcc are dropped. */
    readonly redirectTo?: Addresses;
    /** Observe each send. Errors thrown here are logged and never change the result. */
    readonly onEvent?: (event: MailEvent) => Awaitable<void>;
};
/** A message for `sendRaw`: the sender may come from the mailer. */
export type RawMail = Omit<MailMessage, 'from'> & {
    readonly from?: Address;
};
export type Mailer = {
    /**
     * Validates `input` with the template's schema, renders, and sends. Returns the sent mail or a
     * failure, including `MailInvalidMessage` for a message that cannot be sent as written.
     */
    send<S extends StandardSchemaV1>(template: MailTemplate<S>, input: NoInfer<SchemaInput<S>>, options: SendOptions): Promise<Result<SentMail, SendFailure>>;
    /** Sends content you rendered yourself. */
    sendRaw(message: RawMail, options?: Pick<SendOptions, 'idempotencyKey' | 'signal'>): Promise<Result<SentMail, SendRawFailure>>;
    /**
     * Renders, addresses and checks a mail without sending it: the sender is resolved and the
     * message validated (`MailInvalidMessage` when it cannot be sent as written). `@arki/mail/pg`
     * stores the result to send later.
     */
    compose<S extends StandardSchemaV1>(template: MailTemplate<S>, input: NoInfer<SchemaInput<S>>, options: Omit<SendOptions, 'signal' | 'idempotencyKey'>): Promise<Result<MailMessage, FailureOf<typeof renderTemplate> | FailureOf<typeof MailInvalidMessage>>>;
    /** Renders without sending: previews and content tests. */
    render<S extends StandardSchemaV1>(template: MailTemplate<S>, input: NoInfer<SchemaInput<S>>, context?: RenderContext): Promise<Result<MailContent, FailureOf<typeof renderTemplate>>>;
};
/**
 * @example
 * const mail = mailer({ transport: resend({ apiKey }), from: 'App <hi@app.dev>' });
 * const sent = await mail.send(welcome, { name: 'Ada' }, { to: 'ada@example.com' });
 * if (isFailure(sent)) log.warn(sent.message);
 */
export declare function mailer(options: MailerOptions): Mailer;
//# sourceMappingURL=mailer.d.ts.map