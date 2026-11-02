import type { MailTransport } from '../types.js';
import type { FetchFn } from './post-json.js';
export type MailpitOptions = {
    /** Default `'mailpit'`. */
    readonly id?: string;
    /** Where Mailpit's HTTP API listens, for example `http://localhost:8025`. */
    readonly baseUrl: string;
    /** For tests. Default `globalThis.fetch`. */
    readonly fetch?: FetchFn;
    /** Longest wait for Mailpit to answer, in milliseconds. Default 30 000. */
    readonly timeoutMs?: number;
};
/**
 * @example
 * const mail = mailer({ transport: mailpit({ baseUrl: env.MAILPIT_URL }), from: 'App <hi@app.dev>' });
 */
export declare function mailpit(options: MailpitOptions): MailTransport;
//# sourceMappingURL=mailpit.d.ts.map