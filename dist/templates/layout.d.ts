/**
 * One small HTML layout for the built-in templates. Every interpolated value is HTML-escaped, and
 * the button link must be http(s): a `javascript:` or `data:` link in a mail is an attack.
 */
/** Escapes text for HTML element content and attribute values. */
export declare function escapeHtml(text: string): string;
/** True for an absolute `http:` or `https:` URL. */
export declare function isHttpUrl(value: string): boolean;
export type LayoutContent = {
    /** The heading, and the page title. */
    readonly title: string;
    /** Paragraphs before the button or code. */
    readonly intro: readonly string[];
    /** A button. Its URL must be http(s); template schemas check this first. */
    readonly action?: {
        readonly label: string;
        readonly url: string;
    };
    /** A one-time code shown in large type. */
    readonly code?: string;
    /** Paragraphs after the button or code. */
    readonly outro: readonly string[];
};
/** Renders `content` as a complete HTML document. Throws on a non-http(s) action URL: that is a bug. */
export declare function layout(content: LayoutContent): string;
//# sourceMappingURL=layout.d.ts.map