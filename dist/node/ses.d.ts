/**
 * Amazon SES (v2 API) through `@aws-sdk/client-sesv2`, an optional peer loaded on the first send.
 *
 * The SDK client is built with `maxAttempts: 1`: the SDK does not retry on its own. Retries belong
 * to the caller (the journal worker for queued mail), which knows how many tries are left.
 * SES has no idempotency token, so `idempotencyKey` is not forwarded. Tags go out as SES
 * `EmailTags`, whose names and values SES limits to ASCII letters, digits, `_` and `-`.
 *
 * SES needs SPF, DKIM and DMARC on the sending domain, and new accounts start in the sandbox
 * (200 mails a day, verified recipients only). Bounces and complaints arrive through SNS or a
 * configuration set, not in the response.
 */
import type { MailTransport } from '../types.js';
export type SesOptions = {
    /** Default `'ses'`. */
    readonly id?: string;
    /** The SES region, e.g. `'eu-west-1'`. */
    readonly region: string;
    /** Omit to use the SDK's default chain (environment, shared config, instance role). */
    readonly credentials?: {
        readonly accessKeyId: string;
        readonly secretAccessKey: string;
        readonly sessionToken?: string;
    };
    /** Configuration set for event publishing, reputation and IP pools. */
    readonly configurationSetName?: string;
    /** Monthly budget for `failover`. */
    readonly quotaPerMonth?: number;
    /** Longest wait for SES to answer, in milliseconds. Default 30 000. */
    readonly timeoutMs?: number;
};
/**
 * @example
 * ses({ region: 'eu-west-1', quotaPerMonth: 200_000 })
 */
export declare function ses(options: SesOptions): MailTransport;
//# sourceMappingURL=ses.d.ts.map