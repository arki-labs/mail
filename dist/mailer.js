import { isFailure } from '@arki/failure';
import { invalidConfig, isMailError } from './errors.js';
import { failover } from './failover.js';
import { MailUncertain } from './failures.js';
import { errorField, log } from './log.js';
import { checkMessage, listOf, redirect } from './message.js';
import { renderTemplate } from './template.js';
/**
 * @example
 * const mail = mailer({ transport: resend({ apiKey }), from: 'App <hi@app.dev>' });
 * const sent = await mail.send(welcome, { name: 'Ada' }, { to: 'ada@example.com' });
 * if (isFailure(sent)) log.warn(sent.message);
 */
export function mailer(options) {
    const { from: defaultFrom, redirectTo, onEvent } = options;
    // A lone transport's quota is still a budget; `failover` is what counts it.
    const transport = options.transport.quotaPerMonth === undefined ? options.transport : failover([options.transport]);
    if (defaultFrom.trim() === '')
        invalidConfig('`from` is empty.');
    if (redirectTo !== undefined && listOf(redirectTo).length === 0)
        invalidConfig('`redirectTo` lists no address.');
    const emit = async (event) => {
        if (onEvent === undefined)
            return;
        try {
            await onEvent(event);
        }
        catch (error) {
            log.warn('onEvent threw on a {type} event; the send result is unchanged', {
                type: event.type,
                error: errorField(error),
            });
        }
    };
    const fail = async (failure, template) => {
        await emit({ type: 'failed', failure, template });
        return failure;
    };
    const deliver = async (message, sendOptions) => {
        const invalid = checkMessage(message);
        if (invalid !== undefined)
            return fail(invalid, message.template);
        const outgoing = redirectTo === undefined ? message : redirect(message, redirectTo);
        await emit({ type: 'sending', transport: transport.id, template: message.template });
        let result;
        try {
            result = await transport.send(outgoing, sendOptions);
        }
        catch (error) {
            // Misuse, such as a field the transport cannot carry, stays thrown.
            if (isMailError(error))
                throw error;
            // A transport must not throw otherwise. If one does, the request may have gone out.
            const detail = `the transport threw: ${error instanceof Error ? error.message : String(error)}`;
            return fail(MailUncertain({ transport: transport.id, detail }, { cause: error }), message.template);
        }
        if (isFailure(result))
            return fail(result, message.template);
        await emit({ type: 'sent', result, template: message.template });
        return result;
    };
    const compose = async (template, input, sendOptions) => {
        const rendered = await renderTemplate(template, input, { locale: sendOptions.locale });
        if (isFailure(rendered))
            return rendered;
        const message = {
            ...rendered,
            from: sendOptions.from ?? template.defaults?.from ?? defaultFrom,
            to: sendOptions.to,
            cc: sendOptions.cc,
            bcc: sendOptions.bcc,
            replyTo: sendOptions.replyTo ?? template.defaults?.replyTo,
            template: template.name,
        };
        return checkMessage(message) ?? message;
    };
    return {
        async send(template, input, sendOptions) {
            const composed = await compose(template, input, sendOptions);
            if (isFailure(composed))
                return fail(composed, template.name);
            return deliver(composed, { idempotencyKey: sendOptions.idempotencyKey, signal: sendOptions.signal });
        },
        compose,
        sendRaw: (message, sendOptions = {}) => deliver({ ...message, from: message.from ?? defaultFrom }, sendOptions),
        render: (template, input, context) => renderTemplate(template, input, context),
    };
}
//# sourceMappingURL=mailer.js.map