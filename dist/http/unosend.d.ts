import type { MailTransport } from '../types.js';
import type { FetchFn } from './post-json.js';
export type UnosendOptions = {
    /** Default `'unosend'`. */
    readonly id?: string;
    readonly apiKey: string;
    /** Monthly budget for `failover`. */
    readonly quotaPerMonth?: number;
    /** For tests. Default `globalThis.fetch`. */
    readonly fetch?: FetchFn;
    /** Longest wait for the service to answer, in milliseconds. Default 30 000. */
    readonly timeoutMs?: number;
};
/**
 * @example
 * failover([unosend({ apiKey: env.UNOSEND_API_KEY, quotaPerMonth: 60_000 }), ses({ region: 'eu-west-1' })])
 */
export declare function unosend(options: UnosendOptions): MailTransport;
//# sourceMappingURL=unosend.d.ts.map