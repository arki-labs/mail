/**
 * Reading values of unknown shape (response bodies, SDK errors, template input) without casts.
 * Each helper returns `undefined` when the value does not have the expected shape.
 */
/** `value[key]` when `value` is an object that has `key`; otherwise `undefined`. */
export function fieldOf(value, key) {
    if (typeof value !== 'object' || value === null)
        return undefined;
    return Reflect.get(value, key);
}
/** `value` when it is a string. */
export function stringOf(value) {
    return typeof value === 'string' ? value : undefined;
}
/** `value` when it is an array of strings. Non-string items are dropped. */
export function stringsOf(value) {
    if (!Array.isArray(value))
        return undefined;
    return value.filter((item) => typeof item === 'string');
}
//# sourceMappingURL=narrow.js.map