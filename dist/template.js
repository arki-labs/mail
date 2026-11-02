import { InvalidInput, ValidatorDefect } from '@arki/failure';
import { parseAsync, pathOf } from '@arki/schema';
import { MailInvalidInput } from './failures.js';
/** A path key as JSON can hold it: a symbol key becomes its description. */
const plainKey = (key) => (typeof key === 'symbol' ? String(key) : key);
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
export function defineTemplate(template) {
    return template;
}
/**
 * Validates `input` with the template's schema (sync or async) and renders the content.
 * Needs no transport: use it for previews and content tests. Bad input is `MailInvalidInput`
 * with the schema's issues.
 */
export async function renderTemplate(template, input, context = {}) {
    const data = await parseAsync(template.input, input);
    if (InvalidInput.is(data)) {
        return MailInvalidInput({
            template: template.name,
            issues: data.data.issues.map(issue => ({
                path: pathOf(issue).map(key => plainKey(key)),
                message: issue.message,
            })),
        });
    }
    if (ValidatorDefect.is(data))
        return data;
    const [text, html] = await Promise.all([template.text(data, context), template.html?.(data, context)]);
    return {
        subject: template.subject(data, context),
        text,
        ...(html === undefined ? {} : { html }),
        ...(template.defaults?.headers === undefined ? {} : { headers: template.defaults.headers }),
        ...(template.defaults?.tags === undefined ? {} : { tags: template.defaults.tags }),
    };
}
//# sourceMappingURL=template.js.map