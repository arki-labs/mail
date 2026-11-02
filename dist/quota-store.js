/**
 * Where `failover` counts sends per transport per month. A quota is advisory: two replicas can
 * read the same count and both send. Atomic reservations are a later step (MAIL-QUOTAS).
 */
import { z } from 'zod';
import { isFailure } from '@arki/failure';
import { log } from './log.js';
const memoryKey = (transport, month) => `${transport}:${month}`;
const kvKey = (transport, month) => `email:quota:${transport}:${month}`;
/** Counts in this process only; resets on restart. Right for one instance and for tests. */
export function inMemoryQuotaStore() {
    const counts = new Map();
    return {
        getSent: (transport, month) => Promise.resolve(counts.get(memoryKey(transport, month)) ?? 0),
        increment: (transport, month) => {
            const key = memoryKey(transport, month);
            counts.set(key, (counts.get(key) ?? 0) + 1);
            return Promise.resolve();
        },
    };
}
/** A stored count. Anything else (a corrupt value) is rejected by `get`; a missing key reads as 0. */
const countSchema = z.number().nonnegative();
/** Counters expire after 60 days, well past a month's end. */
const COUNTER_TTL_SECONDS = 60 * 24 * 60 * 60;
/**
 * Counts shared by every replica through a key-value store. Keys: `email:quota:{transport}:{month}`
 * (the prefix predates the package rename; changing it would reset live counters mid-month).
 */
export function kvQuotaStore(kv) {
    return {
        getSent: async (transport, month) => {
            const count = await kv.get(kvKey(transport, month), countSchema);
            return count ?? 0;
        },
        increment: async (transport, month) => {
            const key = kvKey(transport, month);
            const current = await kv.get(key, countSchema);
            if (isFailure(current))
                return current;
            const stored = await kv.set(key, (current ?? 0) + 1, COUNTER_TTL_SECONDS);
            if (isFailure(stored))
                return stored;
            if (!stored)
                log.warn('quota counter for {transport} in {month} was not stored', { transport, month });
            return;
        },
    };
}
//# sourceMappingURL=quota-store.js.map