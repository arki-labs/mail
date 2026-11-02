/**
 * Resend over its REST API with plain `fetch` (no SDK). Runs on Node, Bun and Deno.
 * Carries every message field, and forwards `idempotencyKey` as the `Idempotency-Key` header:
 * Resend keeps a key for 24 hours and refuses a reused key with a different payload.
 */
import { isFailure } from '@arki/failure';
import { listOf } from '../message.js';
import { badResponse, everyRecipient, logged, rejection } from '../transport-failures.js';
import { readAnswer, resendRefusalSchema, resendSentSchema } from './answers.js';
import { postJson } from './post-json.js';
const RESEND_EMAILS_URL = 'https://api.resend.com/emails';
/**
 * @example
 * const mail = mailer({ transport: resend({ apiKey: env.RESEND_API_KEY }), from: 'App <hi@app.dev>' });
 */
export function resend(options) {
    const id = options.id ?? 'resend';
    const fetchFn = options.fetch ?? globalThis.fetch;
    return {
        id,
        ...(options.quotaPerMonth === undefined ? {} : { quotaPerMonth: options.quotaPerMonth }),
        async send(message, sendOptions) {
            const replyTo = listOf(message.replyTo);
            const answer = await postJson({
                transport: id,
                fetch: fetchFn,
                url: RESEND_EMAILS_URL,
                headers: {
                    Authorization: `Bearer ${options.apiKey}`,
                    ...(sendOptions.idempotencyKey === undefined ? {} : { 'Idempotency-Key': sendOptions.idempotencyKey }),
                },
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
                    ...(message.tags === undefined
                        ? {}
                        : { tags: Object.entries(message.tags).map(([name, value]) => ({ name, value })) }),
                },
                ...(sendOptions.signal === undefined ? {} : { signal: sendOptions.signal }),
                ...(options.timeoutMs === undefined ? {} : { timeoutMs: options.timeoutMs }),
            });
            if (isFailure(answer))
                return logged(id, answer);
            const { status, body, retryAfterMs } = answer;
            if (status >= 400) {
                const refusal = readAnswer(resendRefusalSchema, body);
                return logged(id, rejection(id, status, {
                    message: refusal?.message,
                    providerCode: refusal?.name,
                    retryAfterMs,
                }));
            }
            const sent = readAnswer(resendSentSchema, body);
            if (status < 200 || status >= 300 || sent === undefined) {
                return logged(id, badResponse(id, status, 'expected a JSON object'));
            }
            return logged(id, {
                id: sent.id ?? null,
                transport: id,
                status: 'accepted',
                recipients: everyRecipient(message, 'accepted'),
            });
        },
    };
}
//# sourceMappingURL=resend.js.map