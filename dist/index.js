export { isMailError, MAIL_ERROR_CODES, MailError } from './errors.js';
export { MailEnqueueContended, MailExpired, MailInvalidInput, MailInvalidMessage, MailQuotaExhausted, MailRejected, MailTooLarge, MailUncertain, } from './failures.js';
export { defineTemplate, renderTemplate } from './template.js';
export { mailer } from './mailer.js';
export { failover } from './failover.js';
export { inMemoryQuotaStore, kvQuotaStore } from './quota-store.js';
export { logTransport } from './log-transport.js';
//# sourceMappingURL=index.js.map