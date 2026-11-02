/**
 * Reading values of unknown shape (response bodies, SDK errors, template input) without casts.
 * Each helper returns `undefined` when the value does not have the expected shape.
 */
/** `value[key]` when `value` is an object that has `key`; otherwise `undefined`. */
export declare function fieldOf(value: unknown, key: string): unknown;
/** `value` when it is a string. */
export declare function stringOf(value: unknown): string | undefined;
/** `value` when it is an array of strings. Non-string items are dropped. */
export declare function stringsOf(value: unknown): readonly string[] | undefined;
//# sourceMappingURL=narrow.d.ts.map