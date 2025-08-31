# Content Security Policy (CSP) Configuration

## Overview

This document details the Content Security Policy implementation for Mountain Mixology, designed to prevent XSS attacks and reduce the risk of code injection vulnerabilities.

## Current CSP Configuration

The CSP is implemented in `next.config.mjs` and applies to all routes:

```javascript
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://maps.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://maps.googleapis.com https://api.hubspot.com https://hooks.slack.com",
    "frame-src 'self' https://js.stripe.com https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ')
}
```

## Directive Breakdown

### `default-src 'self'`
- **Purpose**: Sets the default policy for all content types
- **Value**: Only allow content from the same origin
- **Security**: Prevents loading of external resources unless explicitly allowed

### `script-src`
- **Purpose**: Controls which scripts can be executed
- **Allowed Sources**:
  - `'self'`: Scripts from the same origin
  - `'unsafe-inline'`: Inline scripts (required for Next.js)
  - `'unsafe-eval'`: Dynamic code evaluation (required for some libraries)
  - `https://js.stripe.com`: Stripe payment integration
  - `https://maps.googleapis.com`: Google Maps integration

### `style-src`
- **Purpose**: Controls stylesheet loading
- **Allowed Sources**:
  - `'self'`: Stylesheets from the same origin
  - `'unsafe-inline'`: Inline styles (required for CSS-in-JS)
  - `https://fonts.googleapis.com`: Google Fonts CSS

### `font-src`
- **Purpose**: Controls font loading
- **Allowed Sources**:
  - `'self'`: Fonts from the same origin
  - `https://fonts.gstatic.com`: Google Fonts assets

### `img-src`
- **Purpose**: Controls image loading
- **Allowed Sources**:
  - `'self'`: Images from the same origin
  - `data:`: Data URIs for inline images
  - `https:`: All HTTPS images (for external CDNs)
  - `blob:`: Blob URLs for dynamically generated images

### `connect-src`
- **Purpose**: Controls AJAX, WebSocket, and EventSource connections
- **Allowed Sources**:
  - `'self'`: API calls to the same origin
  - `https://api.stripe.com`: Stripe API calls
  - `https://maps.googleapis.com`: Google Maps API
  - `https://api.hubspot.com`: HubSpot CRM API
  - `https://hooks.slack.com`: Slack webhook notifications

### `frame-src`
- **Purpose**: Controls embedded frames/iframes
- **Allowed Sources**:
  - `'self'`: Frames from the same origin
  - `https://js.stripe.com`: Stripe checkout frames
  - `https://www.google.com`: Google services (Maps, Calendar)

### `object-src 'none'`
- **Purpose**: Blocks plugins like Flash, Java applets
- **Security**: Prevents plugin-based attacks

### `base-uri 'self'`
- **Purpose**: Controls the `<base>` element
- **Security**: Prevents base tag hijacking

### `form-action 'self'`
- **Purpose**: Controls form submission targets
- **Security**: Prevents forms from submitting to external sites

### `upgrade-insecure-requests`
- **Purpose**: Automatically upgrades HTTP to HTTPS
- **Security**: Ensures all requests use encrypted connections

## Security Benefits

1. **XSS Prevention**: Blocks execution of malicious scripts
2. **Data Exfiltration Prevention**: Limits where data can be sent
3. **Clickjacking Protection**: Controls iframe embedding
4. **Plugin Attack Prevention**: Blocks dangerous plugins
5. **Mixed Content Prevention**: Forces HTTPS usage

## Monitoring and Reporting

### Report-Only Mode (Development)
For testing CSP changes, you can use report-only mode:

```javascript
'Content-Security-Policy-Report-Only': policy
```

### CSP Violations Reporting
To collect CSP violations for monitoring:

```javascript
"report-uri /api/csp-report"
```

### Common Violations to Monitor
- Inline script attempts
- External resource loading attempts
- Frame embedding attempts
- Form submission to external sites

## Maintenance Guidelines

### Regular Reviews
- **Monthly**: Review CSP violation reports
- **Quarterly**: Assess new third-party integrations
- **After Changes**: Test CSP with new features

### Adding New Sources
When adding new external services:

1. Identify the required CSP directive
2. Add the minimum necessary permissions
3. Test in report-only mode first
4. Monitor for violations
5. Update documentation

### Security Considerations
- Avoid `'unsafe-inline'` and `'unsafe-eval'` when possible
- Use nonces or hashes for specific inline scripts
- Keep external source list minimal
- Regular audit of allowed sources

## Known Limitations

### Current Unsafe Directives
- `'unsafe-inline'` in script-src: Required for Next.js hot reload and CSS-in-JS
- `'unsafe-eval'` in script-src: Required for some React dev tools and libraries

### Future Improvements
1. **Nonce-based CSP**: Replace `'unsafe-inline'` with nonces
2. **Hash-based CSP**: Use hashes for specific inline scripts
3. **Stricter image policy**: Implement allowlist for image sources
4. **Subresource Integrity**: Add SRI for external resources

## Testing CSP

### Browser Developer Tools
1. Open browser DevTools
2. Check Console for CSP violations
3. Review Network tab for blocked resources
4. Verify Security tab shows CSP active

### Online CSP Validators
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Observatory by Mozilla](https://observatory.mozilla.org/)

### Automated Testing
```javascript
// Add to your test suite
describe('Content Security Policy', () => {
  it('should have CSP headers', async () => {
    const response = await fetch('/');
    expect(response.headers.get('Content-Security-Policy')).toBeTruthy();
  });
});
```

## Emergency Procedures

### CSP Blocking Critical Functionality
1. Identify the blocked resource from browser console
2. Add temporary exception if needed
3. Plan proper fix (nonce/hash implementation)
4. Update CSP with permanent solution

### False Positive Violations
1. Analyze violation reports
2. Identify legitimate use cases
3. Update CSP policy accordingly
4. Monitor for new violations

Last Updated: 2025-01-01
Next Review: 2025-02-01