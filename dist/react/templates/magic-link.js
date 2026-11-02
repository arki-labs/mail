import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from 'react-email';
export const MagicLinkEmail = ({ loginUrl = 'https://example.com/login', appName = 'App', appUrl = 'https://example.com', }) => (_jsxs(Html, { children: [_jsx(Head, {}), _jsxs(Preview, { children: ["Sign in to ", appName] }), _jsxs(Body, { style: main, children: [_jsx("div", { style: accentBar }), _jsxs(Container, { style: container, children: [_jsx(Section, { style: header, children: _jsx(Heading, { style: h1, children: appName }) }), _jsxs(Section, { style: content, children: [_jsx(Heading, { style: h2, children: "Your magic link is ready" }), _jsxs(Text, { style: paragraph, children: ["Click below to sign in to ", appName, ". This link expires in 10 minutes."] }), _jsx(Section, { style: buttonContainer, children: _jsxs(Button, { href: loginUrl, style: button, children: ["Sign in to ", appName] }) }), _jsx(Hr, { style: hr }), _jsx(Text, { style: smallText, children: "Or copy and paste this link:" }), _jsx(Section, { style: codeContainer, children: _jsx("code", { style: code, children: loginUrl }) })] }), _jsxs(Section, { style: footer, children: [_jsx(Text, { style: footerText, children: "Didn't request this? You can safely ignore this email." }), _jsx(Text, { style: footerText, children: _jsx(Link, { href: `${appUrl}/help`, style: footerLink, children: "Need help?" }) })] })] })] })] }));
export default MagicLinkEmail;
// Styles
const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", "Ubuntu", sans-serif',
};
const accentBar = {
    height: '4px',
    background: 'linear-gradient(90deg, #FF8C42 0%, #FFC857 50%, #4A90E2 100%)',
    margin: '0',
};
const container = {
    margin: '0 auto',
    padding: '0 40px 60px',
    maxWidth: '500px',
};
const header = {
    padding: '48px 0 0',
    textAlign: 'center',
};
const h1 = {
    color: '#1a1a1a',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '1.3',
    margin: '0',
    letterSpacing: '-0.3px',
};
const content = {
    padding: '40px 0',
    textAlign: 'center',
};
const h2 = {
    color: '#1a1a1a',
    fontSize: '26px',
    fontWeight: '600',
    lineHeight: '1.4',
    margin: '0 0 12px',
    letterSpacing: '-0.3px',
};
const paragraph = {
    color: '#525252',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 32px',
};
const buttonContainer = {
    padding: '0 0 32px',
};
const button = {
    background: 'linear-gradient(135deg, #FF8C42 0%, #FFC857 100%)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '16px 32px',
    lineHeight: '1.5',
    boxShadow: '0 4px 12px rgba(255, 140, 66, 0.3)',
    border: 'none',
};
const hr = {
    borderColor: '#e6e6e6',
    margin: '0 0 24px',
    borderTop: '1px solid #e6e6e6',
    borderBottom: 'none',
};
const smallText = {
    color: '#737373',
    fontSize: '13px',
    lineHeight: '1.5',
    margin: '0 0 12px',
};
const codeContainer = {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '12px 16px',
    margin: '0 0 32px',
    border: '1px solid #e5e7eb',
};
const code = {
    color: '#374151',
    fontSize: '13px',
    fontFamily: '"Monaco", "Menlo", "Consolas", monospace',
    wordBreak: 'break-all',
    display: 'block',
    lineHeight: '1.6',
};
const footer = {
    padding: '32px 0 0',
    textAlign: 'center',
    borderTop: '1px solid #e6e6e6',
};
const footerText = {
    color: '#9ca3af',
    fontSize: '13px',
    lineHeight: '1.6',
    margin: '0 0 8px',
};
const footerLink = {
    color: '#FF8C42',
    textDecoration: 'underline',
};
//# sourceMappingURL=magic-link.js.map