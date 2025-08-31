# Threat Model - Mountain Mixology

## Overview

This document outlines the security threat model for the Mountain Mixology cocktail catering platform, including data flow diagrams, trust boundaries, assets, and potential attack vectors.

## System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Client Web    │    │   Next.js App    │    │   Express Server    │
│   Browser       │◄──►│   (Frontend)     │◄──►│   (Backend)         │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                                │                         │
                                ▼                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     External Services                               │
├─────────────────┬─────────────────┬─────────────────┬───────────────┤
│   PostgreSQL    │    Stripe       │   HubSpot CRM   │   Google      │
│   Database      │   Payments      │   Customer Mgmt │   Calendar    │
└─────────────────┴─────────────────┴─────────────────┴───────────────┘
                                │
                                ▼
├─────────────────┬─────────────────┬─────────────────┬───────────────┤
│   Gmail SMTP    │   Mailchimp     │   Slack Bot     │   Cloudinary  │
│   Email Service │   Marketing     │   Notifications │   Media CDN   │
└─────────────────┴─────────────────┴─────────────────┴───────────────┘
```

## Trust Boundaries

### 1. Client-Server Boundary
- **Trust Level**: Untrusted → Trusted
- **Boundary**: Web browser to Next.js application
- **Controls**: Input validation, authentication, CSRF protection

### 2. Application-Database Boundary
- **Trust Level**: Trusted → Trusted
- **Boundary**: Express server to PostgreSQL
- **Controls**: Parameterized queries, connection pooling, access controls

### 3. Application-External Services Boundary
- **Trust Level**: Trusted → External (Various)
- **Boundary**: Application to third-party APIs
- **Controls**: API key management, rate limiting, request validation

## Assets

### High Value Assets
1. **Customer Data**
   - Personal information (names, emails, phone numbers)
   - Event details and preferences
   - Payment information (handled by Stripe)

2. **Business Data**
   - Customer relationships (HubSpot)
   - Event bookings and calendar data
   - Financial transaction records

3. **Authentication Credentials**
   - Admin accounts
   - API keys for external services
   - Session tokens

### Medium Value Assets
4. **Marketing Data**
   - Email lists (Mailchimp)
   - Analytics data
   - User behavior patterns

5. **Operational Data**
   - Application logs
   - Performance metrics
   - Error reports

## Threat Actors

### 1. External Attackers
- **Motivation**: Financial gain, data theft
- **Capabilities**: Automated tools, social engineering
- **Access**: Internet-facing applications

### 2. Malicious Insiders
- **Motivation**: Financial gain, revenge
- **Capabilities**: Legitimate access, system knowledge
- **Access**: Admin accounts, server access

### 3. Competitors
- **Motivation**: Business intelligence, disruption
- **Capabilities**: Targeted attacks, social engineering
- **Access**: Public interfaces, social networks

## Attack Scenarios

### 1. Data Breach (High Risk)
**Attack Vector**: SQL injection, XSS, or compromised credentials
```
Attacker → Vulnerable Input Field → Database Access → Data Exfiltration
```
**Impact**: Customer data exposure, regulatory violations, reputation damage
**Mitigations**: 
- Parameterized queries (Drizzle ORM)
- Input validation (Zod schemas)
- Content Security Policy
- Access logging and monitoring

### 2. Payment Fraud (High Risk)
**Attack Vector**: Man-in-the-middle, session hijacking
```
Attacker → Intercept Payment → Modify Transaction → Financial Loss
```
**Impact**: Financial loss, PCI compliance violations
**Mitigations**:
- HTTPS enforcement (HSTS)
- Stripe's secure payment processing
- Session security (secure cookies)

### 3. Account Takeover (Medium Risk)
**Attack Vector**: Credential stuffing, phishing, session fixation
```
Attacker → Obtain Credentials → Admin Access → Data Manipulation
```
**Impact**: Unauthorized access, data manipulation
**Mitigations**:
- Strong password policies
- Session management
- Account lockout policies
- Multi-factor authentication (future)

### 4. API Abuse (Medium Risk)
**Attack Vector**: Rate limiting bypass, API key theft
```
Attacker → Enumerate API → Abuse Rate Limits → Service Degradation
```
**Impact**: Service disruption, increased costs
**Mitigations**:
- Rate limiting implementation
- API key rotation
- Request validation
- Monitoring and alerting

### 5. Cross-Site Scripting (Medium Risk)
**Attack Vector**: Stored or reflected XSS
```
Attacker → Malicious Script → User Browser → Session Hijacking
```
**Impact**: Session theft, defacement, malware distribution
**Mitigations**:
- Content Security Policy
- Input sanitization
- React's built-in XSS protection
- Output encoding

### 6. Dependency Vulnerabilities (Low-Medium Risk)
**Attack Vector**: Vulnerable npm packages
```
Attacker → Exploit Known CVE → Remote Code Execution → System Compromise
```
**Impact**: System compromise, data breach
**Mitigations**:
- Regular dependency audits
- Automated security updates
- Dependency pinning
- SBOM generation

## Security Controls

### Preventive Controls
- Input validation and sanitization
- Authentication and authorization
- Encryption in transit and at rest
- Content Security Policy
- Dependency management

### Detective Controls
- Security logging and monitoring
- Dependency vulnerability scanning
- Regular security audits
- Error tracking and alerting

### Corrective Controls
- Incident response procedures
- Backup and recovery plans
- Security patch management
- User notification systems

## Risk Assessment Matrix

| Threat | Likelihood | Impact | Risk Level | Priority |
|---------|-----------|---------|------------|----------|
| Data Breach | Medium | High | High | 1 |
| Payment Fraud | Low | High | Medium | 2 |
| Account Takeover | Medium | Medium | Medium | 3 |
| API Abuse | Medium | Low | Low | 4 |
| XSS Attack | Low | Medium | Low | 5 |
| Dependency Vulns | High | Medium | Medium | 2 |

## Recommendations

### Immediate Actions (1-30 days)
1. Implement comprehensive input validation
2. Enable security headers and CSP
3. Set up automated dependency scanning
4. Implement proper error handling

### Short Term (1-3 months)
1. Add comprehensive logging and monitoring
2. Implement rate limiting
3. Set up incident response procedures
4. Conduct penetration testing

### Long Term (3-12 months)
1. Implement multi-factor authentication
2. Set up SIEM system
3. Regular security training
4. Third-party security assessments

## Review and Updates

This threat model should be reviewed and updated:
- Quarterly for risk assessment updates
- After significant architecture changes
- Following security incidents
- When new threats are identified

Last Updated: 2025-01-01
Next Review: 2025-04-01