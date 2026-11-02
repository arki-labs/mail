import { MAIL_ERROR_CODES, MailError } from '../errors.js';
import { errorField } from '../log.js';
import { listOf } from '../message.js';
import { readAnswer, sesErrorSchema, sesResponseHeadersSchema } from '../http/answers.js';
import { everyRecipient, logged, rejection, requestSignal, retryAfterMs, uncertain } from '../transport-failures.js';
// SES's documented charset name. SES expects this exact spelling, not Node's `utf8`.
// eslint-disable-next-line unicorn/text-encoding-identifier-case -- SES API value, not a Node encoding
const SES_CHARSET = 'UTF-8';
/** Memoizes the first call's promise; a rejected load is tried again on the next send. */
function once(load) {
    let pending;
    return () => {
        pending ??= load().catch((error) => {
            pending = undefined;
            throw error;
        });
        return pending;
    };
}
/**
 * An SDK error with an HTTP status came from SES. Without one, the request never got an answer
 * (network failure, timeout, abort), and SES may have taken the mail. `reason` says which ended it.
 * A throttled answer (429) carries the `Retry-After` header the SDK keeps in `$response`, when present.
 */
function sdkFailure(transport, error, reason) {
    const read = readAnswer(sesErrorSchema, error);
    const status = read?.$metadata?.httpStatusCode;
    if (status === undefined)
        return uncertain(transport, error, reason());
    const providerCode = read?.name;
    return rejection(transport, status, {
        message: errorField(error).message,
        ...(providerCode === undefined ? {} : { providerCode }),
        ...(retryAfter(error) === undefined ? {} : { retryAfterMs: retryAfter(error) }),
    });
}
/** `Retry-After` from the raw HTTP response the SDK attaches to a service error, when it kept one. */
function retryAfter(error) {
    const headers = readAnswer(sesResponseHeadersSchema, error)?.$response?.headers;
    return retryAfterMs(headers?.['retry-after']);
}
/**
 * @example
 * ses({ region: 'eu-west-1', quotaPerMonth: 200_000 })
 */
export function ses(options) {
    const id = options.id ?? 'ses';
    const loadSdk = once(async () => {
        const { SESv2Client, SendEmailCommand } = await import('@aws-sdk/client-sesv2');
        const client = new SESv2Client({
            region: options.region,
            maxAttempts: 1,
            ...(options.credentials === undefined ? {} : { credentials: options.credentials }),
        });
        return { client, SendEmailCommand };
    });
    return {
        id,
        ...(options.quotaPerMonth === undefined ? {} : { quotaPerMonth: options.quotaPerMonth }),
        async send(message, sendOptions) {
            let sdk;
            try {
                sdk = await loadSdk();
            }
            catch (error) {
                // A missing peer is a setup mistake, not an answer from SES.
                throw new MailError(MAIL_ERROR_CODES.invalidConfig, `${id}: @aws-sdk/client-sesv2 could not be loaded (${errorField(error).message})`, { cause: error });
            }
            const replyTo = listOf(message.replyTo);
            const command = new sdk.SendEmailCommand({
                FromEmailAddress: message.from,
                Destination: {
                    ToAddresses: [...listOf(message.to)],
                    ...(message.cc === undefined ? {} : { CcAddresses: [...listOf(message.cc)] }),
                    ...(message.bcc === undefined ? {} : { BccAddresses: [...listOf(message.bcc)] }),
                },
                ...(replyTo.length === 0 ? {} : { ReplyToAddresses: [...replyTo] }),
                ...(message.tags === undefined
                    ? {}
                    : { EmailTags: Object.entries(message.tags).map(([Name, Value]) => ({ Name, Value })) }),
                Content: {
                    Simple: {
                        Subject: { Data: message.subject, Charset: SES_CHARSET },
                        Body: {
                            Text: { Data: message.text, Charset: SES_CHARSET },
                            ...(message.html === undefined ? {} : { Html: { Data: message.html, Charset: SES_CHARSET } }),
                        },
                        ...(message.headers === undefined
                            ? {}
                            : { Headers: Object.entries(message.headers).map(([Name, Value]) => ({ Name, Value })) }),
                    },
                },
                ...(options.configurationSetName === undefined ? {} : { ConfigurationSetName: options.configurationSetName }),
            });
            const attempt = requestSignal(sendOptions.signal, options.timeoutMs);
            try {
                const response = await sdk.client.send(command, { abortSignal: attempt.signal });
                return logged(id, {
                    id: response.MessageId ?? null,
                    transport: id,
                    status: 'accepted',
                    recipients: everyRecipient(message, 'accepted'),
                });
            }
            catch (error) {
                return logged(id, sdkFailure(id, error, attempt.reason));
            }
        },
    };
}
//# sourceMappingURL=ses.js.map