import { MailRejected } from './failures.js';
import { listOf } from './message.js';
import { everyRecipient } from './transport-failures.js';
export { transportContract } from './testing/transport-contract.js';
/** `a@b` from `Name <a@b>`, lower-cased. */
const mailboxOf = (address) => (/<([^>]+)>/.exec(address)?.[1] ?? address).trim().toLowerCase();
/** A transport that sends nothing and records each mail, reported as `simulated`. */
export function mailSink() {
    const id = 'sink';
    let records = [];
    let pendingFailure;
    return {
        id,
        get sent() {
            return records;
        },
        send(message, options) {
            if (pendingFailure !== undefined) {
                const failure = pendingFailure;
                pendingFailure = undefined;
                return Promise.resolve(failure);
            }
            records = [...records, { message, template: message.template, idempotencyKey: options.idempotencyKey }];
            return Promise.resolve({
                id: null,
                transport: id,
                status: 'simulated',
                recipients: everyRecipient(message, 'accepted'),
            });
        },
        sentWith(template) {
            return records.filter((record) => record.template === template.name);
        },
        sentTo(address) {
            const wanted = mailboxOf(address);
            return records.filter(({ message }) => [...listOf(message.to), ...listOf(message.cc), ...listOf(message.bcc)].some(recipient => mailboxOf(recipient) === wanted));
        },
        last: () => records.at(-1),
        failNext(failure = MailRejected({ transport: id, retryable: false, detail: 'mailSink: failNext' })) {
            pendingFailure = failure;
        },
        clear() {
            records = [];
            pendingFailure = undefined;
        },
    };
}
//# sourceMappingURL=testing.js.map