import type { MailTransport } from '../types.js';
import type { FetchFn } from './post-json.js';
export type CloudflareOptions = {
    /** Default `'cloudflare'`. */
    readonly id?: string;
    /** Cloudflare account id (32 hex characters). */
    readonly accountId: string;
    /** API token with the `Email Sending: Edit` permission. */
    readonly apiToken: string;
    /** Monthly budget for `failover`. Workers Paid includes 3 000. */
    readonly quotaPerMonth?: number;
    /** For tests. Default `globalThis.fetch`. */
    readonly fetch?: FetchFn;
    /** Longest wait for the service to answer, in milliseconds. Default 30 000. */
    readonly timeoutMs?: number;
};
/**
 * @example
 * cloudflare({ accountId: env.CLOUDFLARE_ACCOUNT_ID, apiToken: env.CLOUDFLARE_EMAIL_TOKEN, quotaPerMonth: 3_000 })
 */
export declare function cloudflare(options: CloudflareOptions): MailTransport;
//# sourceMappingURL=cloudflare.d.ts.map