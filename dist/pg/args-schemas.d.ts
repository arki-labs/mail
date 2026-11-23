/**
 * The Zod schemas of a queued mail. Internal: `args.ts` and `testing.ts` read rows with them. The TS types
 * (`MailMessage`, `QueuedArgs`) are the source; `args.test-d.ts` locks each schema to its type both ways.
 */
import { z } from 'zod';
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
/** A `QueuedArgs` (`args.ts`): what a queue row holds. */
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
//# sourceMappingURL=args-schemas.d.ts.map