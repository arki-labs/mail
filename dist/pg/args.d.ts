/** The stored shape of a queued mail, and reading it back without trusting it. */
import { z } from 'zod';
import type { ScheduledJob } from '@arki/journal';
/** The queue row's job name. The version is part of the stored shape. */
export declare const MAIL_JOB = "mail.deliver.v1";
/**
 * A stored message, checked field by field: the row may predate a deploy or be edited by hand.
 * `args.test-d.ts` locks its output to `MailMessage`.
 */
export declare const mailMessageSchema: z.ZodReadonly<z.ZodObject<{
    from: z.ZodString;
    subject: z.ZodString;
    text: z.ZodString;
    to: z.ZodUnion<readonly [z.ZodString, z.ZodReadonly<z.ZodArray<z.ZodString>>]>;
    html: z.ZodExactOptional<z.ZodString>;
    cc: z.ZodExactOptional<z.ZodUnion<readonly [z.ZodString, z.ZodReadonly<z.ZodArray<z.ZodString>>]>>;
    bcc: z.ZodExactOptional<z.ZodUnion<readonly [z.ZodString, z.ZodReadonly<z.ZodArray<z.ZodString>>]>>;
    replyTo: z.ZodExactOptional<z.ZodUnion<readonly [z.ZodString, z.ZodReadonly<z.ZodArray<z.ZodString>>]>>;
    headers: z.ZodExactOptional<z.ZodReadonly<z.ZodRecord<z.ZodString, z.ZodString>>>;
    tags: z.ZodExactOptional<z.ZodReadonly<z.ZodRecord<z.ZodString, z.ZodString>>>;
    template: z.ZodExactOptional<z.ZodString>;
}, z.core.$strip>>;
/** What a queue row holds. */
export declare const queuedArgsSchema: z.ZodReadonly<z.ZodObject<{
    version: z.ZodLiteral<1>;
    message: z.ZodReadonly<z.ZodObject<{
        from: z.ZodString;
        subject: z.ZodString;
        text: z.ZodString;
        to: z.ZodUnion<readonly [z.ZodString, z.ZodReadonly<z.ZodArray<z.ZodString>>]>;
        html: z.ZodExactOptional<z.ZodString>;
        cc: z.ZodExactOptional<z.ZodUnion<readonly [z.ZodString, z.ZodReadonly<z.ZodArray<z.ZodString>>]>>;
        bcc: z.ZodExactOptional<z.ZodUnion<readonly [z.ZodString, z.ZodReadonly<z.ZodArray<z.ZodString>>]>>;
        replyTo: z.ZodExactOptional<z.ZodUnion<readonly [z.ZodString, z.ZodReadonly<z.ZodArray<z.ZodString>>]>>;
        headers: z.ZodExactOptional<z.ZodReadonly<z.ZodRecord<z.ZodString, z.ZodString>>>;
        tags: z.ZodExactOptional<z.ZodReadonly<z.ZodRecord<z.ZodString, z.ZodString>>>;
        template: z.ZodExactOptional<z.ZodString>;
    }, z.core.$strip>>;
    expiresAt: z.ZodExactOptional<z.ZodString>;
}, z.core.$strip>>;
export type QueuedArgs = z.output<typeof queuedArgsSchema>;
/** The row's args, or a permanent failure: a row that cannot be read will never send. */
export declare function queuedArgs(job: ScheduledJob): QueuedArgs;
//# sourceMappingURL=args.d.ts.map