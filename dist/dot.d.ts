import type { MailerOptions } from './mailer.js';
/** The mailer as a Dot service named `mail`. */
export declare function mail(options: MailerOptions | (() => MailerOptions)): Omit<import("@arki/dot/unit").Unit<import("@arki/dot/unit").WireNeeds<import("@arki/dot/unit").EmptyShape>, import("@arki/dot/unit").ProvidedValues<{
    mail: import("./mailer.js").Mailer;
}>, import("@arki/dot/unit").EmptyShape, "mail", import("@arki/dot/unit").EmptyOwnership, import("@arki/dot/unit").EmptyPhases>, "factories" | "hooks" | "logging"> & import("@arki/dot/unit").LoggingSlot<import("@arki/dot/unit").DotLoggingHandle<undefined>> & import("@arki/dot/unit").FactoryContract<import("@arki/dot/unit").ProvidedValues<{
    mail: import("./mailer.js").Mailer;
}>> & {
    readonly factories: {
        readonly mail: (ctx: never) => import("./mailer.js").Mailer;
    };
    readonly hooks: import("@arki/dot/unit").PhaseHooks<never, {
        readonly configure: undefined;
        readonly start: undefined;
        readonly stop: undefined;
        readonly dispose: undefined;
    }, import("@arki/dot/unit").DotConfigureContext> & import("@arki/dot/unit").BootSlot<import("@arki/dot/unit").CtxOf<import("@arki/dot/unit").EmptyShape> & import("@arki/dot/unit").ProvidedValues<{
        mail: import("./mailer.js").Mailer;
    }> & import("@arki/dot/unit").KernelCtx, undefined>;
} & import("@arki/dot/unit").InfraRole;
//# sourceMappingURL=dot.d.ts.map