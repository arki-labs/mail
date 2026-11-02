/**
 * Assertions on queued mail, for tests. They read committed rows, not function calls: a mail
 * queued inside a transaction that rolled back is not there, which is the point.
 */
import { and, eq, isNotNull, isNull } from 'drizzle-orm';
import { is, recordSchema } from '@arki/schema';
import { MAIL_JOB, mailMessageSchema } from './args.js';
export function mailQueueAssertions(db, tables) {
    const { jobs } = tables;
    const read = async (dead, template) => {
        const rows = await db
            .select({
            id: jobs.id,
            args: jobs.args,
            attempts: jobs.attempts,
            lastError: jobs.lastError,
            dedupeKey: jobs.dedupeKey,
        })
            .from(jobs)
            .where(and(eq(jobs.jobName, MAIL_JOB), dead ? isNotNull(jobs.deadAt) : isNull(jobs.deadAt)))
            .orderBy(jobs.id);
        return rows.flatMap(row => {
            const message = is(row.args, recordSchema) ? row.args['message'] : undefined;
            if (!is(message, mailMessageSchema))
                return [];
            if (template !== undefined && message.template !== template.name)
                return [];
            return [
                {
                    jobId: row.id,
                    template: message.template,
                    to: message.to,
                    subject: message.subject,
                    text: message.text,
                    attempts: row.attempts,
                    lastError: row.lastError,
                    idempotencyKey: row.dedupeKey,
                },
            ];
        });
    };
    return {
        /** Mail waiting to be sent (or to be retried), optionally of one template. */
        queued: (template) => read(false, template),
        /** Mail that ran out of tries or failed for good. */
        dead: () => read(true),
    };
}
//# sourceMappingURL=testing.js.map