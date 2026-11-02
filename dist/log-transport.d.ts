import type { MailTransport } from './types.js';
/**
 * Sends nothing: logs each mail at debug level (`DEBUG=arki:mail`) and reports it as
 * `simulated`. For local development, in place of a real transport.
 */
export declare function logTransport(options?: {
    readonly id?: string;
}): MailTransport;
//# sourceMappingURL=log-transport.d.ts.map