import { is } from '@arki/schema';
import { MAIL_ERROR_CODES, MailError } from '../errors.js';
import { queuedArgsSchema } from './args-schemas.js';
/** The queue row's job name. The version is part of the stored shape. */
export const MAIL_JOB = 'mail.deliver.v1';
/** The row's args, or a permanent failure: a row that cannot be read will never send. */
export function queuedArgs(job) {
    if (is(job.args, queuedArgsSchema))
        return job.args;
    throw new MailError(MAIL_ERROR_CODES.badQueuedData, `Queued mail ${job.id} does not hold a ${MAIL_JOB} message.`);
}
//# sourceMappingURL=args.js.map