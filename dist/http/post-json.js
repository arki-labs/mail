import { requestSignal, retryAfterMs, uncertain } from '../transport-failures.js';
/**
 * POSTs `body` as JSON. A request that fails in transit, times out (`timeoutMs`, default 30 s) or is
 * aborted, or whose answer cannot be read to the end, is `MailUncertain`: the service may have taken
 * the mail. Its `reason` tells a caller's cancel from a timeout and from a network fault.
 */
export async function postJson(request) {
    let status;
    let text;
    let wait;
    const attempt = requestSignal(request.signal, request.timeoutMs);
    try {
        const response = await request.fetch(request.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...request.headers },
            body: JSON.stringify(request.body),
            signal: attempt.signal,
        });
        status = response.status;
        wait = retryAfterMs(response.headers.get('retry-after'));
        text = await response.text();
    }
    catch (error) {
        return uncertain(request.transport, error, attempt.reason());
    }
    const retryAfter = wait === undefined ? {} : { retryAfterMs: wait };
    try {
        const body = text === '' ? undefined : JSON.parse(text);
        return { status, body, ...retryAfter };
    }
    catch {
        return { status, body: undefined, ...retryAfter };
    }
}
//# sourceMappingURL=post-json.js.map