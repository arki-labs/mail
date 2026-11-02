/**
 * Queued mail in a Dot app. A separate entry from `@arki/mail/dot` because it needs
 * `@arki/journal`, an optional peer: an app that only sends mail never installs the journal.
 *
 * - `mailOutboxPlugin({ tables })` provides `mailOutbox`, queued mail on the journal; it needs `mail`
 *   from `@arki/mail/dot`.
 * - `mailJobs()` runs that queue in the journal worker: `journalWorker({ jobs: mailJobs() })`.
 *
 * @example
 * defineApp('shop')
 *   .infra(mail(() => ({ transport: resend({ apiKey: env.RESEND_API_KEY }), from: 'Shop <hi@shop.dev>' })))
 *   .infra(mailOutboxPlugin({ tables }))
 *   .entrypoints(journalWorker({ jobs: mailJobs() }))
 */
import type { Service } from '@arki/dot/unit';
import type { JournalTables } from '@arki/journal';
import type { JobsSource } from '@arki/journal/dot';
import type { Backoff } from '@arki/resilience';
import type { Mailer } from './mailer.js';
import type { MailOutbox } from './pg/index.js';
export type MailOutboxPluginOptions = {
    readonly tables: Pick<JournalTables, 'jobs'>;
    /** Waits between tries. Default: 5 s doubling to 1 h, 5 tries in all. */
    readonly retry?: Backoff;
    /** Largest stored message, in bytes of JSON. Default 256 KiB. */
    readonly maxBytes?: number;
};
/** Queued mail on the journal as a Dot service named `mailOutbox`. Needs the `mail` service. */
export declare function mailOutboxPlugin(options: MailOutboxPluginOptions): Omit<import("@arki/dot/unit").Unit<import("@arki/dot/unit").WireNeeds<{
    mail: Service<Mailer>;
}>, import("@arki/dot/unit").ProvidedValues<{
    mailOutbox: MailOutbox;
}>, {
    mail: Service<Mailer>;
}, "mail-outbox", import("@arki/dot/unit").EmptyOwnership, import("@arki/dot/unit").EmptyPhases>, "factories" | "hooks" | "logging"> & import("@arki/dot/unit").LoggingSlot<import("@arki/dot/unit").DotLoggingHandle<undefined>> & import("@arki/dot/unit").FactoryContract<import("@arki/dot/unit").ProvidedValues<{
    mailOutbox: MailOutbox;
}>> & {
    readonly factories: {
        readonly mailOutbox: (ctx: never) => MailOutbox;
    };
    readonly hooks: import("@arki/dot/unit").PhaseHooks<never, {
        readonly configure: undefined;
        readonly start: undefined;
        readonly stop: undefined;
        readonly dispose: undefined;
    }, import("@arki/dot/unit").DotConfigureContext> & import("@arki/dot/unit").BootSlot<import("@arki/dot/unit").CtxOf<{
        mail: Service<Mailer>;
    }> & import("@arki/dot/unit").ProvidedValues<{
        mailOutbox: MailOutbox;
    }> & import("@arki/dot/unit").KernelCtx, undefined>;
} & import("@arki/dot/unit").InfraRole;
/** The queued-mail runner for `journalWorker({ jobs })`. A worker without `mailOutbox` fails at boot. */
export declare function mailJobs(): JobsSource<{
    readonly mailOutbox: Service<MailOutbox>;
}>;
//# sourceMappingURL=outbox.d.ts.map