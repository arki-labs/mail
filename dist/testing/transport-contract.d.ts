import type { MailMessage, MailTransport } from '../types.js';
export type TransportHarness = {
    /** Name for the describe block. */
    readonly label: string;
    /** The `id` the factory gives when none is passed. */
    readonly defaultId: string;
    /** Builds the transport under test, wired to the fake service. */
    create(options?: {
        readonly quotaPerMonth?: number;
    }): MailTransport;
    /** The message id the fake service returns on success, or `null` when the service gives none. */
    readonly expectedId: string | null;
    /** The next request succeeds. */
    succeed(): void;
    /** The next request is answered with this HTTP status and the service's error body. */
    respondWith(status: number): void;
    /** The next request fails in transit with this message. */
    failInTransit(message: string): void;
    /** Requests the fake service received since `reset`. */
    requestCount(): number;
    /** The idempotency key the last request carried. Omit when the service takes none. */
    readonly lastIdempotencyKey?: () => string | undefined;
    /** The abort signal the last request carried, if any. */
    lastSignal(): AbortSignal | undefined;
    /** Message fields this transport cannot carry. Omit when it carries them all. */
    readonly unsupported?: Partial<Pick<MailMessage, 'tags' | 'replyTo'>>;
    /** Clears the fake service between tests. */
    reset(): void;
};
/** Defines the shared transport suite for one harness. Call it at the top level of a spec file. */
export declare function transportContract(harness: TransportHarness): void;
//# sourceMappingURL=transport-contract.d.ts.map