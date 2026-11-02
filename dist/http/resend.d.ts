import type { MailTransport } from '../types.js';
import type { FetchFn } from './post-json.js';
export type ResendOptions = {
    /** Default `'resend'`. Set it when two Resend accounts share one mailer. */
    readonly id?: string;
    /** API key, starts with `re_`. */
    readonly apiKey: string;
    /** Monthly budget for `failover`. Free tier: 3 000. */
    readonly quotaPerMonth?: number;
    /** For tests. Default `globalThis.fetch`. */
    readonly fetch?: FetchFn;
    /** Longest wait for Resend to answer, in milliseconds. Default 30 000. */
    readonly timeoutMs?: number;
};
/**
 * @example
 * const mail = mailer({ transport: resend({ apiKey: env.RESEND_API_KEY }), from: 'App <hi@app.dev>' });
 */
export declare function resend(options: ResendOptions): MailTransport;
//# sourceMappingURL=resend.d.ts.map