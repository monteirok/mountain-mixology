#!/usr/bin/env node

/**
 * Generate Secure Session Secret
 * 
 * This script generates a cryptographically secure session secret
 * for use in the .env file.
 * 
 * Usage: node scripts/generate-secret.js
 */

const crypto = require('crypto');

function generateSessionSecret() {
  // Generate 32 bytes of random data and convert to base64
  const secret = crypto.randomBytes(32).toString('base64');
  
  console.log('🔑 Generated secure session secret:');
  console.log('');
  console.log(`SESSION_SECRET=${secret}`);
  console.log('');
  console.log('📋 Copy this line to your .env file');
  console.log('⚠️  Keep this secret secure and never share it publicly!');
  
  return secret;
}

// Run the generator
if (require.main === module) {
  generateSessionSecret();
}

module.exports = { generateSessionSecret };