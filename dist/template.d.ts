/**
 * Templates are plain objects. One Standard Schema types both sides: callers pass its input,
 * renderers receive its output (defaults applied, values coerced).
 */
import type { SchemaInput, SchemaOutput, StandardSchemaV1 } from '@arki/schema';
import type { Address, Addresses, Awaitable, RenderContext } from './types.js';
export type MailTemplate<S extends StandardSchemaV1 = StandardSchemaV1, Name extends string = string> = {
    /** Stable name, for logs, the test sink and queued mail. */
    readonly name: Name;
    readonly input: S;
    readonly subject: (data: SchemaOutput<S>, context: RenderContext) => string;
    readonly text: (data: SchemaOutput<S>, context: RenderContext) => Awaitable<string>;
    readonly html?: (data: SchemaOutput<S>, context: RenderContext) => Awaitable<string>;
    readonly defaults?: {
        readonly from?: Address;
        readonly replyTo?: Addresses;
        readonly headers?: Readonly<Record<string, string>>;
        readonly tags?: Readonly<Record<string, string>>;
    };
};
/**
 * Defines a template. Returns it unchanged; the point is the inferred types.
 *
 * @example
 * const welcome = defineTemplate({
 *   name: 'welcome',
 *   input: z.object({ name: z.string() }),
 *   subject: data => `Welcome, ${data.name}`,
 *   text: data => `Hello ${data.name}, your account is ready.`,
 * });
 */
export declare function defineTemplate<S extends StandardSchemaV1, const Name extends string>(template: MailTemplate<S, Name>): MailTemplate<S, Name>;
/**
 * Validates `input` with the template's schema (sync or async) and renders the content.
 * Needs no transport: use it for previews and content tests. Bad input is `MailInvalidInput`
 * with the schema's issues.
 */
export declare function renderTemplate<S extends StandardSchemaV1>(template: MailTemplate<S>, input: NoInfer<SchemaInput<S>>, context?: RenderContext): Promise<import("@arki/failure").Failure<"mail.invalid_input", {
    template: string;
    issues: {
        path: (string | number)[];
        message: string;
    }[];
}> | import("@arki/failure").Failure<"schema.validator_defect", undefined> | {
    subject: string;
    text: string;
    html?: string | undefined;
    headers?: Readonly<Record<string, string>> | undefined;
    tags?: Readonly<Record<string, string>> | undefined;
}>;
//# sourceMappingURL=template.d.ts.map