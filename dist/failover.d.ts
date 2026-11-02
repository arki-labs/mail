import type { QuotaStore } from './quota-store.js';
import type { MailTransport } from './types.js';
export type FailoverOptions = {
    /** Where sends are counted. Default: in this process only. */
    readonly store?: QuotaStore;
    /** The clock, for tests. */
    readonly now?: () => Date;
};
/** Throws `ARKI_MAIL_E001` when the list is empty or two transports share an id. */
export declare function assertTransports(transports: readonly MailTransport[]): void;
/** One transport that tries `transports` in order. Its id is theirs, joined by `|`. */
export declare function failover(transports: readonly MailTransport[], options?: FailoverOptions): MailTransport;
//# sourceMappingURL=failover.d.ts.map