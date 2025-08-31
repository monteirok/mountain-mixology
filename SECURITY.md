# Security Policy

## Supported Versions

We actively support and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

The Mountain Mixology team takes security seriously. We appreciate responsible disclosure of security vulnerabilities.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities to:
- **Email**: security@mountainmixology.com
- **Subject**: [SECURITY] Brief description of the vulnerability

### What to Include

When reporting a security vulnerability, please include:

1. **Type of vulnerability** (e.g., XSS, CSRF, injection, etc.)
2. **Affected component(s)** (URLs, parameters, etc.)
3. **Steps to reproduce** the vulnerability
4. **Proof of concept** (if applicable)
5. **Potential impact** of the vulnerability
6. **Suggested fix** (if you have one)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Assessment**: Within 5 business days
- **Fix Timeline**: 
  - Critical vulnerabilities: 1-3 days
  - High severity: 1-2 weeks
  - Medium/Low severity: 2-4 weeks

### Security Measures

This application implements multiple layers of security:

#### Authentication & Authorization
- Secure admin bootstrap with cryptographically strong passwords
- Session-based authentication with secure cookies
- Environment variable validation at startup

#### Network Security
- Content Security Policy (CSP) headers
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options to prevent clickjacking
- X-Content-Type-Options to prevent MIME sniffing

#### Data Protection
- Input validation using Zod schemas
- SQL injection prevention via parameterized queries (Drizzle ORM)
- XSS prevention through React's built-in escaping

#### Infrastructure Security
- Security headers configured in Next.js
- Secure image handling with CSP
- Permission policies to restrict browser APIs

### Security Dependencies

We regularly monitor and update dependencies for security vulnerabilities:
- Monthly dependency audits via `npm audit`
- Automated security updates where possible
- Manual review of security advisories

### Responsible Disclosure

We follow responsible disclosure practices:
- We will acknowledge receipt of your report
- We will provide regular updates on our progress
- We will credit you in our security advisories (if desired)
- We request that you do not publicly disclose the vulnerability until we have had a chance to fix it

## Contact

For general security questions or concerns:
- Email: security@mountainmixology.com
- For urgent security matters: Include [URGENT] in the subject line

Thank you for helping keep Mountain Mixology and our users safe!