/**
 * Unosend over its REST API with plain `fetch`. Runs on Node, Bun and Deno.
 * Unosend has no tags: a message with `tags` is refused (`ARKI_MAIL_E005`) before any request.
 * No idempotency header is sent, as Unosend documents none.
 */
import { isFailure } from '@arki/failure';
import { listOf } from '../message.js';
import { badResponse, everyRecipient, logged, rejection, unsupported } from '../transport-failures.js';
import { codeText, readAnswer, unosendRefusalSchema, unosendSentSchema } from './answers.js';
import { postJson } from './post-json.js';
const UNOSEND_EMAILS_URL = 'https://www.unosend.com/api/v1/emails';
/** The error text and code, top level (`{ message, code }`) or nested (`{ error: { message, code } }`). */
function errorDetail(body) {
    const refusal = readAnswer(unosendRefusalSchema, body);
    const nested = refusal?.error;
    const source = typeof nested === 'object' ? nested : refusal;
    const message = source?.message ?? (typeof nested === 'string' ? nested : undefined);
    const providerCode = codeText(source?.code);
    return {
        ...(message === undefined ? {} : { message }),
        ...(providerCode === undefined ? {} : { providerCode }),
    };
}
/**
 * @example
 * failover([unosend({ apiKey: env.UNOSEND_API_KEY, quotaPerMonth: 60_000 }), ses({ region: 'eu-west-1' })])
 */
export function unosend(options) {
    const id = options.id ?? 'unosend';
    const fetchFn = options.fetch ?? globalThis.fetch;
    return {
        id,
        ...(options.quotaPerMonth === undefined ? {} : { quotaPerMonth: options.quotaPerMonth }),
        async send(message, sendOptions) {
            if (message.tags !== undefined && Object.keys(message.tags).length > 0) {
                unsupported(id, 'Unosend has no tags.');
            }
            const replyTo = listOf(message.replyTo);
            const answer = await postJson({
                transport: id,
                fetch: fetchFn,
                url: UNOSEND_EMAILS_URL,
                headers: { Authorization: `Bearer ${options.apiKey}` },
                body: {
                    from: message.from,
                    to: listOf(message.to),
                    subject: message.subject,
                    text: message.text,
                    ...(message.html === undefined ? {} : { html: message.html }),
                    ...(message.cc === undefined ? {} : { cc: listOf(message.cc) }),
                    ...(message.bcc === undefined ? {} : { bcc: listOf(message.bcc) }),
                    ...(replyTo.length === 0 ? {} : { reply_to: replyTo }),
                    ...(message.headers === undefined ? {} : { headers: message.headers }),
                },
                ...(sendOptions.signal === undefined ? {} : { signal: sendOptions.signal }),
                ...(options.timeoutMs === undefined ? {} : { timeoutMs: options.timeoutMs }),
            });
            if (isFailure(answer))
                return logged(id, answer);
            const { status, body, retryAfterMs } = answer;
            if (status >= 400)
                return logged(id, rejection(id, status, { ...errorDetail(body), retryAfterMs }));
            const sent = readAnswer(unosendSentSchema, body);
            if (status < 200 || status >= 300 || sent === undefined) {
                return logged(id, badResponse(id, status, 'expected a JSON object'));
            }
            return logged(id, {
                id: sent.id ?? sent.data?.id ?? null,
                transport: id,
                status: 'accepted',
                recipients: everyRecipient(message, 'accepted'),
            });
        },
    };
}
//# sourceMappingURL=unosend.js.map