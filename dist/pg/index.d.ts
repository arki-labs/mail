import type { FailureOf } from '@arki/failure';
import type { DbHandle, JobRunner, JournalTables } from '@arki/journal';
import type { Backoff } from '@arki/resilience';
import type { SchemaInput, StandardSchemaV1 } from '@arki/schema';
import { jobId } from '@arki/journal';
import type { Mailer } from '../mailer.js';
import type { MailTemplate, renderTemplate } from '../template.js';
import type { SendOptions } from '../types.js';
import type { MailInvalidMessage } from '../failures.js';
import { MailTooLarge } from '../failures.js';
export { MAIL_JOB } from './args.js';
/** A transaction: it has `rollback()`, which the root database does not. */
export type MailTx = DbHandle & {
    rollback(): never;
};
export type MailOutboxOptions = {
    readonly mailer: Mailer;
    readonly tables: Pick<JournalTables, 'jobs'>;
    /** Waits between tries. Default: 5 s doubling to 1 h, 5 tries in all. */
    readonly retry?: Backoff;
    /** Largest stored message, in bytes of JSON. Default 256 KiB. */
    readonly maxBytes?: number;
};
export type EnqueueOptions = Omit<SendOptions, 'signal'> & {
    /** After this moment the mail is not sent; the job is dead with `MailExpired`. */
    readonly expiresAt?: Date;
};
export type MailOutbox = {
    /**
     * Queues one mail inside `tx`. Returns `MailInvalidInput` when the template's schema refuses
     * the input, `MailInvalidMessage` when the message cannot be sent as written (an empty address,
     * a line break), and `MailTooLarge` when it is over `maxBytes`; nothing is queued. Throws
     * {@link MailError}: `E009` for the root database, `E002` unless there is exactly one `to`
     * recipient. The same `idempotencyKey` while a job is still queued returns that job (`deduped: true`).
     */
    enqueue<S extends StandardSchemaV1>(tx: MailTx, template: MailTemplate<S>, input: NoInfer<SchemaInput<S>>, options: EnqueueOptions): Promise<{
        readonly jobId: string;
        readonly deduped: boolean;
    } | FailureOf<typeof renderTemplate> | FailureOf<typeof MailInvalidMessage> | FailureOf<typeof MailTooLarge> | FailureOf<typeof jobId>>;
    /** Runs queued mail: pass it to `journal.worker(db, { jobs })`, or combine it with `combineRunners`. */
    readonly runner: JobRunner;
};
export declare function mailOutbox(options: MailOutboxOptions): MailOutbox;
//# sourceMappingURL=index.d.ts.map