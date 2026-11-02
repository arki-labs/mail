/**
 * The template's schema refused the input. Nothing was sent.
 *
 * @fix Fix the input to match the template's schema. The same input fails again.
 * @verify bun run test -- src/template.spec.ts
 */
export declare const MailInvalidInput: import("@arki/failure").FailureDefinition<"mail.invalid_input", import("@standard-schema/spec").StandardSchemaV1<{
    template: string;
    issues: {
        path: (string | number)[];
        message: string;
    }[];
}, {
    template: string;
    issues: {
        path: (string | number)[];
        message: string;
    }[];
}>>;
/**
 * Every transport is over its monthly quota. Nothing was sent.
 *
 * @fix Add a transport without a quota as a fallback, or raise a quota.
 * @verify bun run test -- src/failover.spec.ts
 */
export declare const MailQuotaExhausted: import("@arki/failure").FailureDefinition<"mail.quota_exhausted", import("@standard-schema/spec").StandardSchemaV1<{
    month: string;
}, {
    month: string;
}>>;
/**
 * The service refused the mail, so it surely did not take it. `retryable` is true for HTTP 429
 * and 5xx, when trying later can help. `upstreamStatus` is the service's HTTP status.
 *
 * @fix Retry later when `data.retryable` is true. Otherwise fix the mail or the account settings.
 * @verify bun run test -- src/failover.spec.ts
 */
export declare const MailRejected: import("@arki/failure").FailureDefinition<"mail.rejected", import("@standard-schema/spec").StandardSchemaV1<{
    transport: string;
    retryable: boolean;
    upstreamStatus?: number | undefined;
    providerCode?: string | undefined;
    detail?: string | undefined;
    retryAfterMs?: number | undefined;
}, {
    transport: string;
    retryable: boolean;
    upstreamStatus?: number | undefined;
    providerCode?: string | undefined;
    detail?: string | undefined;
    retryAfterMs?: number | undefined;
}>>;
/**
 * No readable answer: a timeout, a network failure, or an answer that could not be read. The
 * service may have taken the mail, so trying another service could deliver it twice.
 *
 * @fix Send it again later with the same idempotency key. The service may already have taken it.
 * @verify bun run test -- src/failover.spec.ts
 */
export declare const MailUncertain: import("@arki/failure").FailureDefinition<"mail.uncertain", import("@standard-schema/spec").StandardSchemaV1<{
    transport: string;
    detail: string;
    upstreamStatus?: number | undefined;
    reason?: "cancelled" | "network" | "timeout" | "unreadable" | undefined;
}, {
    transport: string;
    detail: string;
    upstreamStatus?: number | undefined;
    reason?: "cancelled" | "network" | "timeout" | "unreadable" | undefined;
}>>;
/**
 * A queued mail's `expiresAt` passed before it could be sent. Nothing was sent.
 *
 * @fix Queue a new mail, such as a fresh sign-in link.
 * @verify bun run test -- src/mailer.spec.ts
 */
export declare const MailExpired: import("@arki/failure").FailureDefinition<"mail.expired", import("@standard-schema/spec").StandardSchemaV1<{
    expiresAt: string;
}, {
    expiresAt: string;
}>>;
/**
 * The message cannot be sent as written: no recipient, an empty address, a line break in an address,
 * the subject or a header (header injection), or a header the message owns. Nothing was sent.
 * Recipients are usually typed by a user, so this is an expected outcome, not a bug.
 *
 * @fix Show the user what is wrong with the address, or remove the line break or reserved header. The same message fails again.
 * @verify bun run test -- src/message.spec.ts
 */
export declare const MailInvalidMessage: import("@arki/failure").FailureDefinition<"mail.invalid_message", import("@standard-schema/spec").StandardSchemaV1<{
    problem: string;
}, {
    problem: string;
}>>;
/**
 * The rendered message is larger than the outbox allows (`maxBytes`). Nothing was queued.
 *
 * @fix Shorten the content, or raise `maxBytes`. Put large files elsewhere and link them.
 * @verify bun run test -- src/pg
 */
export declare const MailTooLarge: import("@arki/failure").FailureDefinition<"mail.too_large", import("@standard-schema/spec").StandardSchemaV1<{
    bytes: number;
    maxBytes: number;
}, {
    bytes: number;
    maxBytes: number;
}>>;
//# sourceMappingURL=failures.d.ts.map