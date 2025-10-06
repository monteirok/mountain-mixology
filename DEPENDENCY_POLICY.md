# Dependency Management Policy

## Overview

This document outlines the dependency management strategy for Mountain Mixology, focusing on security, stability, and maintainability of third-party packages.

## Dependency Categories

### Production Dependencies
Critical packages required for application runtime:
- **Framework**: Next.js, React
- **Backend**: Express, Drizzle ORM
- **UI Components**: Radix UI, Lucide React
- **Integrations**: Stripe, HubSpot, Google APIs
- **Utilities**: Zod, Framer Motion, Tailwind CSS

### Development Dependencies
Packages used only during development:
- **Build Tools**: TypeScript, ESBuild
- **Testing**: (To be implemented)
- **Linting**: ESLint, Prettier
- **Type Definitions**: @types/* packages

### Optional Dependencies
Non-critical packages that enhance functionality:
- **Performance**: bufferutil (WebSocket optimization)

## Update Strategy

### Security Updates
- **Critical Vulnerabilities**: Update immediately (within 24 hours)
- **High Severity**: Update within 1 week
- **Medium/Low Severity**: Update in next minor release cycle
- **Development-only vulnerabilities**: Update in next maintenance window

### Regular Updates
- **Major Version Updates**: Quarterly review and testing
- **Minor Version Updates**: Monthly evaluation
- **Patch Updates**: Weekly automated checks

### Update Process
1. **Automated Scanning**: Daily `npm audit` checks
2. **Impact Assessment**: Review breaking changes and security implications
3. **Testing**: Verify functionality in development environment
4. **Staged Rollout**: Deploy to staging before production
5. **Documentation**: Update CHANGE_LOG.md with dependency changes

## Pinning Strategy

### Production Environment
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### Exact Versioning for Critical Packages
```json
{
  "next": "15.4.4",
  "react": "18.3.1",
  "stripe": "18.4.0"
}
```

### Range Versioning for Utilities
```json
{
  "clsx": "^2.1.1"
}
```

## Security Scanning

### Automated Tools
- **npm audit**: Built-in vulnerability scanner
- **GitHub Dependabot**: Automated security updates
- **SBOM Generation**: Software Bill of Materials for compliance

### Manual Reviews
- **Quarterly**: Full dependency review
- **Before Major Releases**: Complete security audit
- **After Security Incidents**: Targeted assessment

### Vulnerability Response
1. **Identify**: Automated scanning and manual monitoring
2. **Assess**: Evaluate impact and exploitability
3. **Prioritize**: Based on CVSS score and business impact
4. **Fix**: Update, patch, or replace vulnerable dependencies
5. **Verify**: Test fixes in isolation
6. **Document**: Record in SECURITY_LOG.md

## Dependency Evaluation Criteria

### New Dependencies
Before adding any new dependency, evaluate:

#### Security
- [ ] Active maintenance (commits within 6 months)
- [ ] Security track record (no recent critical vulnerabilities)
- [ ] Maintainer reputation and community trust
- [ ] Code review process and contributor verification

#### Technical
- [ ] TypeScript support or @types package availability
- [ ] Bundle size impact (< 100KB for non-critical features)
- [ ] Performance implications
- [ ] Browser compatibility
- [ ] Tree-shaking support

#### Business
- [ ] License compatibility (MIT, BSD, Apache 2.0 preferred)
- [ ] Long-term viability and community support
- [ ] Alternative options available
- [ ] Alignment with project architecture

### Dependency Approval Process
1. **Proposal**: Document need and alternatives
2. **Technical Review**: Security and performance assessment
3. **Security Review**: Vulnerability and maintenance status
4. **Approval**: Team lead sign-off required
5. **Integration**: Controlled rollout with monitoring

## Known Vulnerable Dependencies

### Current Vulnerabilities (as of 2025-01-01)
Based on `npm audit` results:

#### esbuild (Development)
- **Vulnerability**: GHSA-67mh-4wv8-2f99
- **Impact**: Development server request vulnerability
- **Mitigation**: Production builds unaffected, monitoring for updates
- **Status**: Acceptable risk for development environment

#### Next.js (Production)
- **Vulnerabilities**: 
  - GHSA-xv57-4mr9-wg8v (Content Injection)
  - GHSA-4342-x723-ch2f (SSRF via Middleware)
  - GHSA-g5qg-72qw-gw5v (Cache Key Confusion)
- **Impact**: Various security implications
- **Mitigation**: Additional security headers, input validation, monitoring for updates
- **Status**: Monitoring for patches, implementing defense-in-depth

## Maintenance Schedule

### Daily
- Automated vulnerability scanning
- Dependabot security alerts review

### Weekly
- Review and merge non-breaking security updates
- Assess new vulnerability reports

### Monthly
- Evaluate minor version updates
- Review dependency usage and cleanup unused packages
- Update development dependencies

### Quarterly
- Major version update assessment
- Comprehensive security audit
- License compliance review
- Architecture alignment review

## Tools and Automation

### Package Management
```bash
# Security audit
npm audit --audit-level=moderate

# Update check
npm outdated

# Clean install
npm ci

# License check
npm ls --depth=0 --license
```

### CI/CD Integration
```yaml
# Example GitHub Actions workflow
name: Dependency Check
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Security Audit
        run: npm audit --audit-level=moderate
      - name: Generate SBOM
        run: npm sbom --output=sbom.json
```

### Monitoring
- **Dependabot**: Automated security updates
- **npm-check-updates**: Version update notifications
- **License compliance**: Automated license scanning

## Emergency Procedures

### Critical Vulnerability Response
1. **Immediate Assessment**: Within 2 hours of notification
2. **Hotfix Preparation**: Identify and test fix
3. **Emergency Deployment**: Fast-track security updates
4. **Communication**: Notify stakeholders of actions taken
5. **Post-Incident Review**: Document lessons learned

### Dependency Compromise
If a trusted dependency is compromised:
1. **Immediate Removal**: Remove from package.json
2. **Impact Assessment**: Check for malicious code execution
3. **System Scan**: Verify system integrity
4. **Replacement**: Find and implement alternative
5. **Incident Report**: Document and share with community

## Compliance and Reporting

### SBOM Generation
- **Format**: CycloneDX JSON
- **Frequency**: Every release
- **Content**: All direct and transitive dependencies
- **Storage**: Version control and artifact repository

### License Compliance
- **Approved Licenses**: MIT, BSD, Apache 2.0, ISC
- **Review Process**: Legal team consultation for new licenses
- **Documentation**: Maintain license inventory

### Audit Trail
All dependency changes must be documented with:
- **Reason**: Why the change was made
- **Security Review**: Assessment results
- **Testing**: Verification performed
- **Rollback Plan**: How to revert if needed

## Contact and Escalation

### Security Issues
- **Primary**: security@mountainmixology.com
- **Emergency**: Include [URGENT-DEP] in subject line

### Approval Required
Dependency changes requiring approval:
- New production dependencies
- Major version updates
- License changes
- Security-related updates in production

Last Updated: 2025-01-01
Next Review: 2025-02-01
