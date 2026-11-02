import type { StandardSchemaV1 } from '@arki/schema';
import type { MailTemplate } from '../template.js';
export type AuthLinkInput = {
    readonly appName: string;
    readonly url: string;
    readonly expiresInMinutes?: number;
};
export type AuthLinkData = {
    readonly appName: string;
    readonly url: string;
    readonly expiresInMinutes: number;
};
export type SignInCodeInput = {
    readonly appName: string;
    readonly code: string;
};
export declare const magicLink: MailTemplate<StandardSchemaV1<AuthLinkInput, AuthLinkData>, "auth.magic-link">;
export declare const verifyEmail: MailTemplate<StandardSchemaV1<AuthLinkInput, AuthLinkData>, "auth.verify-email">;
export declare const resetPassword: MailTemplate<StandardSchemaV1<AuthLinkInput, AuthLinkData>, "auth.reset-password">;
export declare const signInCode: MailTemplate<StandardSchemaV1<SignInCodeInput, SignInCodeInput>, "auth.sign-in-code">;
//# sourceMappingURL=auth.d.ts.map