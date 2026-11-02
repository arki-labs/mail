import type { DbHandle, JournalTables } from '@arki/journal';
export type QueuedMail = {
    readonly jobId: string;
    readonly template: string | undefined;
    readonly to: string | readonly string[];
    readonly subject: string;
    readonly text: string;
    readonly attempts: number;
    readonly lastError: string | null;
    readonly idempotencyKey: string | null;
};
export declare function mailQueueAssertions(db: DbHandle, tables: Pick<JournalTables, 'jobs'>): {
    /** Mail waiting to be sent (or to be retried), optionally of one template. */
    queued: (template?: {
        readonly name: string;
    }) => Promise<readonly QueuedMail[]>;
    /** Mail that ran out of tries or failed for good. */
    dead: () => Promise<readonly QueuedMail[]>;
};
//# sourceMappingURL=testing.d.ts.map