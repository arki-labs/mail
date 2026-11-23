import type { Failure } from '@arki/failure';
import type { StandardSchemaV1 } from '@arki/schema';
export type QuotaStore = {
    /** Sends counted for `transport` in `month` (`YYYY-MM`, UTC). A failure means the count could not be read. */
    getSent(transport: string, month: string): Promise<number | Failure>;
    /** Counts one accepted send. A failure means the count could not be stored. */
    increment(transport: string, month: string): Promise<void | Failure>;
};
/** Counts in this process only; resets on restart. Right for one instance and for tests. */
export declare function inMemoryQuotaStore(): QuotaStore;
/**
 * The part of a key-value store `kvQuotaStore` needs. `@arki/kv` fits, so does a test double.
 * `get` checks the stored value against the count schema (any Standard Schema, so this type names no Zod type)
 * and returns a failure when Redis is down or the value is not a count.
 */
export type KVLike = {
    get(key: string, schema: StandardSchemaV1<unknown, number>): Promise<number | undefined | Failure>;
    set(key: string, value: number, ttlSeconds?: number): Promise<boolean | Failure>;
};
/**
 * Counts shared by every replica through a key-value store. Keys: `email:quota:{transport}:{month}`
 * (the prefix predates the package rename; changing it would reset live counters mid-month).
 */
export declare function kvQuotaStore(kv: KVLike): QuotaStore;
//# sourceMappingURL=quota-store.d.ts.map