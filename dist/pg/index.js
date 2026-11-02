/**
 * Mail that commits with the business write. `enqueue` renders the mail and inserts one journal
 * queue row in the caller's transaction: a rollback drops the mail with the write, a commit
 * makes it durable. The journal worker sends it through `runner`, retries failures that can
 * succeed later (`MailUncertain`, a `retryable` `MailRejected`), and dead-letters the rest. It
 * is the only thing that retries.
 *
 * The row stores the rendered message, not the template input, so every retry sends the same
 * bytes and a template changed after the enqueue cannot change a mail already queued.
 *
 * Delivery is at least once. The job id is passed to the transport as the idempotency key, so a
 * provider that supports keys drops a repeat within its own window (Resend: 24 hours).
 */
import { and, eq, sql } from 'drizzle-orm';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { isFailure } from '@arki/failure';
import { jobId } from '@arki/journal';
import { backoff } from '@arki/resilience';
import { isMailError, MAIL_ERROR_CODES, MailError } from '../errors.js';
import { MailExpired, MailRejected, MailTooLarge, MailUncertain } from '../failures.js';
import { listOf } from '../message.js';
import { MAIL_JOB, queuedArgs } from './args.js';
export { MAIL_JOB } from './args.js';
const WAKE_PAYLOAD = '{"queue":1}';
const DEFAULT_MAX_BYTES = 256 * 1024;
/** 5 s, 10 s, 20 s, … capped at 1 h; dead after the 5th try. */
const DEFAULT_RETRY = backoff.exponential({ base: 5000, max: 3_600_000 }).upTo(4);
/**
 * A queued send that returned a failure. The journal fails a try only when the runner throws, so
 * the runner throws this; the message is the failure as JSON, so `lastError` keeps its code.
 */
class QueuedSendFailed extends Error {
    failure;
    constructor(failure) {
        super(JSON.stringify(failure), { cause: failure.cause });
        this.name = 'QueuedSendFailed';
        this.failure = failure;
    }
}
/** A later try can help: the service may not have taken the mail, or refused it for now (429, 5xx). */
const worthRetrying = (failure) => MailUncertain.is(failure) || (MailRejected.is(failure) && failure.data.retryable);
export function mailOutbox(options) {
    const { mailer, tables } = options;
    const retry = options.retry ?? DEFAULT_RETRY;
    const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
    // The journal's wake channel: every journal worker of this table hears it.
    const tableSchema = getTableConfig(tables.jobs).schema;
    const channel = tableSchema === undefined ? 'journal_wake' : `${tableSchema}_journal_wake`;
    const enqueue = async (tx, template, input, enqueueOptions) => {
        if (typeof Reflect.get(tx, 'rollback') !== 'function') {
            throw new MailError(MAIL_ERROR_CODES.needsTransaction, 'enqueue needs the transaction of the write it belongs to.');
        }
        if (listOf(enqueueOptions.to).length !== 1 || enqueueOptions.cc !== undefined || enqueueOptions.bcc !== undefined) {
            throw new MailError(MAIL_ERROR_CODES.invalidMessage, 'A queued mail has exactly one `to` recipient and no cc or bcc.');
        }
        const composed = await mailer.compose(template, input, enqueueOptions);
        if (isFailure(composed))
            return composed;
        const args = {
            version: 1,
            message: composed,
            ...(enqueueOptions.expiresAt === undefined ? {} : { expiresAt: enqueueOptions.expiresAt.toISOString() }),
        };
        const bytes = new TextEncoder().encode(JSON.stringify(args)).byteLength;
        if (bytes > maxBytes)
            return MailTooLarge({ bytes, maxBytes });
        const dedupeKey = enqueueOptions.idempotencyKey ?? null;
        const id = jobId();
        if (isFailure(id))
            return id;
        const inserted = await tx
            .insert(tables.jobs)
            .values({ id, kind: 'queue', jobName: MAIL_JOB, args, dedupeKey })
            .onConflictDoNothing()
            .returning({ id: tables.jobs.id });
        const [row] = inserted;
        if (row !== undefined) {
            // Delivered at commit, dropped on rollback.
            await tx.execute(sql `select pg_notify(${channel}, ${WAKE_PAYLOAD})`);
            return { jobId: row.id, deduped: false };
        }
        // Only the dedupe index can refuse the insert: a job with this key is still queued.
        const [existing] = await tx
            .select({ id: tables.jobs.id })
            .from(tables.jobs)
            .where(and(eq(tables.jobs.jobName, MAIL_JOB), eq(tables.jobs.dedupeKey, dedupeKey ?? '')));
        if (existing === undefined)
            throw new Error('mail enqueue: insert refused but no queued job holds the key');
        return { jobId: existing.id, deduped: true };
    };
    const runner = {
        names: [MAIL_JOB],
        run: async (job, { signal }) => {
            const queued = queuedArgs(job);
            if (queued.expiresAt !== undefined && Date.parse(queued.expiresAt) <= Date.now()) {
                throw new QueuedSendFailed(MailExpired({ expiresAt: queued.expiresAt }));
            }
            const result = await mailer.sendRaw(queued.message, { idempotencyKey: job.id, signal });
            if (isFailure(result))
                throw new QueuedSendFailed(result);
        },
        // Misuse and a failure no retry can fix are dead now; anything else waits for the next try.
        retryDelay: (job, error) => {
            const dead = isMailError(error) || (error instanceof QueuedSendFailed && !worthRetrying(error.failure));
            const wait = dead ? undefined : retry.delay(job.attempt, error);
            // A service that said how long to wait (Retry-After) is not asked again sooner.
            const asked = error instanceof QueuedSendFailed && MailRejected.is(error.failure) ? error.failure.data.retryAfterMs : undefined;
            return wait === undefined || asked === undefined ? wait : Math.max(wait, asked);
        },
    };
    return { enqueue, runner };
}
//# sourceMappingURL=index.js.map