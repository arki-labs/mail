/**
 * Spans and a counter for sends and provider calls. Safe without an OpenTelemetry SDK: the API then
 * does nothing. A telemetry fault (a broken SDK or exporter) never changes a result or hides an error.
 *
 * Attributes are bounded and safe: an operation, a provider, the transport id and template name the
 * app chose in code, and a failure code. Never addresses, subjects, bodies, headers, tags,
 * idempotency keys, message ids or API keys.
 */
import type { Attributes } from '@opentelemetry/api';
import type { MailTransport } from './types.js';
/**
 * Runs one mail operation inside a `mail.<operation>` span and counts it in `mail.operations` by
 * `operation` and `outcome` (`success`, `failure` for a returned failure, `error` for a throw). A
 * returned failure sets `failure.code`; the span status is error only when `isFault(failure)`
 * (`mail.uncertain`), not for a refusal the caller handles. A throw (`MailError`, misuse) is recorded
 * and rethrown unchanged.
 */
export declare function observeMail<T>(operation: string, attributes: Attributes, execute: () => Promise<T>): Promise<T>;
/**
 * The same transport with each send in a `mail.<provider>.send` span (`mail.resend.send`), carrying
 * `mail.provider` and `mail.transport`. Every provider transport wraps itself in this, so a failover
 * shows one provider span per attempt under the `mail.send` span.
 */
export declare function traceTransport(provider: string, transport: MailTransport): MailTransport;
//# sourceMappingURL=telemetry.d.ts.map