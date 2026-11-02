import { render } from '@react-email/render';
export async function renderReact(element) {
    const [html, text] = await Promise.all([render(element), render(element, { plainText: true })]);
    return { html, text };
}
//# sourceMappingURL=index.js.map