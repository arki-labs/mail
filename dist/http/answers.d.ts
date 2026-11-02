/**
 * What each service's answer looks like, as schemas. An answer is outside data: a field of the
 * wrong type is read as absent, never as a crash, and the whole answer not being an object reads
 * as "nothing usable". One schema per service answer, so the shape is written once.
 */
import { z } from 'zod';
export declare const resendRefusalSchema: z.ZodObject<{
    message: z.ZodOptional<z.ZodPipe<z.ZodUnknown, z.ZodTransform<string | undefined, unknown>>>;
    name: z.ZodOptional<z.ZodPipe<z.ZodUnknown, z.ZodTransform<string | undefined, unknown>>>;
}, z.core.$strip>;
export declare const resendSentSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodPipe<z.ZodUnknown, z.ZodTransform<string | undefined, unknown>>>;
}, z.core.$strip>;
export declare const mailpitRefusalSchema: z.ZodObject<{
    Error: z.ZodOptional<z.ZodPipe<z.ZodUnknown, z.ZodTransform<string | undefined, unknown>>>;
}, z.core.$strip>;
export declare const mailpitSentSchema: z.ZodObject<{
    ID: z.ZodOptional<z.ZodPipe<z.ZodUnknown, z.ZodTransform<string | undefined, unknown>>>;
}, z.core.$strip>;
/** Cloudflare's envelope: `success`, the `errors` list, and the `result` of a send. */
export declare const cloudflareAnswerSchema: z.ZodObject<{
    success: z.ZodOptional<z.ZodPipe<z.ZodUnknown, z.ZodTransform<boolean | undefined, unknown>>>;
    errors: z.ZodOptional<z.ZodPipe<z.ZodUnknown, z.ZodTransform<{
        message?: string | undefined;
        code?: string | number | undefined;
    }[] | undefined, unknown>>>;
    result: z.ZodOptional<z.ZodPipe<z.ZodUnknown, z.ZodTransform<{
        message_id?: string | undefined;
        delivered?: string[] | undefined;
        queued?: string[] | undefined;
        permanent_bounces?: string[] | undefined;
        suppressed_recipients?: string[] | undefined;
    } | undefined, unknown>>>;
}, z.core.$strip>;
/** Unosend sends the error top level (`{ message, code }`) or nested (`{ error: { message, code } }` or `{ error: "text" }`). */
export declare const unosendRefusalSchema: z.ZodObject<{
    message: z.ZodOptional<z.ZodPipe<z.ZodUnknown, z.ZodTransform<string | undefined, unknown>>>;
    code: z.ZodOptional<z.ZodPipe<z.ZodUnknown, z.ZodTransform<string | number | undefined, unknown>>>;
    error: z.ZodOptional<z.ZodPipe<z.ZodUnknown, z.ZodTransform<string | {
        message?: string | undefined;
        code?: string | number | undefined;
    } | undefined, unknown>>>;
}, z.core.$strip>;
export declare const unosendSentSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodPipe<z.ZodUnknown, z.ZodTransform<string | undefined, unknown>>>;
    data: z.ZodOptional<z.ZodPipe<z.ZodUnknown, z.ZodTransform<{
        id?: string | undefined;
    } | undefined, unknown>>>;
}, z.core.$strip>;
/** The parts of an AWS SDK error the SES transport reads. */
export declare const sesErrorSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodPipe<z.ZodUnknown, z.ZodTransform<string | undefined, unknown>>>;
    $metadata: z.ZodOptional<z.ZodPipe<z.ZodUnknown, z.ZodTransform<{
        httpStatusCode?: number | undefined;
    } | undefined, unknown>>>;
}, z.core.$strip>;
/** The raw HTTP response an AWS SDK service error keeps, for its headers. */
export declare const sesResponseHeadersSchema: z.ZodObject<{
    $response: z.ZodOptional<z.ZodPipe<z.ZodUnknown, z.ZodTransform<{
        headers?: Record<string, string> | undefined;
    } | undefined, unknown>>>;
}, z.core.$strip>;
/**
 * `body` read with `schema`, or `undefined` when it is not an object the schema accepts (no
 * body, a string, a list). The fields the schema reads never throw.
 */
export declare function readAnswer<Schema extends z.ZodType>(schema: Schema, body: unknown): z.output<Schema> | undefined;
/** A code from a service as text: `4001` and `"4001"` both read `"4001"`. */
export declare function codeText(value: string | number | undefined): string | undefined;
//# sourceMappingURL=answers.d.ts.map