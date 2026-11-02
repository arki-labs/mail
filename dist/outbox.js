import { infra, service } from '@arki/dot/unit';
import { mailOutbox } from './pg/index.js';
/** Queued mail on the journal as a Dot service named `mailOutbox`. Needs the `mail` service. */
export function mailOutboxPlugin(options) {
    return infra({
        name: 'mail-outbox',
        needs: { mail: service() },
        configure(ctx) {
            ctx.registerService('mailOutbox', 'queue');
            ctx.declareProvides('mailOutbox');
        },
        provides: { mailOutbox: ({ mail: mailService }) => mailOutbox({ ...options, mailer: mailService }) },
    });
}
/** The queued-mail runner for `journalWorker({ jobs })`. A worker without `mailOutbox` fails at boot. */
export function mailJobs() {
    return {
        needs: { mailOutbox: service() },
        build: (_features, services) => services.mailOutbox.runner,
    };
}
//# sourceMappingURL=outbox.js.map