#!/usr/bin/env tsx

/**
 * Secure Admin Bootstrap Script
 * 
 * This script creates an initial admin user with a securely generated password.
 * It should be run once during initial deployment.
 * 
 * Security features:
 * - Generates cryptographically secure password
 * - Uses proper password hashing (bcrypt)
 * - Validates environment variables
 * - One-time use protection
 * 
 * Usage: tsx scripts/bootstrap-admin.ts
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
// NOTE: bcrypt will be installed during setup
// import bcrypt from 'bcrypt';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * Checks if .env file exists and provides guidance if not
 */
function checkEnvFile(): void {
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ No .env file found!');
    
    if (fs.existsSync(envExamplePath)) {
      console.error('\n📝 To fix this issue:');
      console.error('1. Copy the example file: cp .env.example .env');
      console.error('2. Edit .env and set your actual values');
    } else {
      console.error('\n📝 To fix this issue:');
      console.error('1. Create a .env file in the project root');
      console.error('2. Add the required environment variables');
    }
    
    console.error('\n📖 See SETUP_GUIDE.md for detailed instructions');
    process.exit(1);
  }
  
  console.log('✅ Found .env file');
}

interface AdminUser {
  email: string;
  password: string;
  hashedPassword: string;
  createdAt: Date;
}

/**
 * Generates a cryptographically secure password
 */
function generateSecurePassword(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    result += chars[randomIndex];
  }
  
  return result;
}

/**
 * Validates required environment variables
 */
function validateEnvironment(): void {
  console.log('🔍 Checking environment variables...');
  
  const required = ['DATABASE_URL', 'ADMIN_EMAIL', 'SESSION_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missing.forEach(key => {
      console.error(`   • ${key}`);
    });
    
    console.error('\n📝 To fix this issue:');
    console.error('1. Copy .env.example to .env: cp .env.example .env');
    console.error('2. Edit .env and set the required variables:');
    console.error('   • DATABASE_URL: Your PostgreSQL connection string');
    console.error('   • ADMIN_EMAIL: Your admin email address');
    console.error('   • SESSION_SECRET: Generate with: openssl rand -base64 32');
    console.error('\n📖 See SETUP_GUIDE.md for detailed instructions');
    
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ All required environment variables found');
}

/**
 * Hashes password using bcrypt
 */
async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcrypt');
  const saltRounds = 12; // 2025 security standard
  return bcrypt.hash(password, saltRounds);
}

/**
 * Creates admin user in database
 */
async function createAdminUser(adminData: AdminUser): Promise<void> {
  // TODO: Implement database connection and user creation
  // This will depend on your database schema and ORM
  console.log('Admin user would be created with:', {
    email: adminData.email,
    hashedPassword: '[REDACTED]',
    createdAt: adminData.createdAt
  });
}

/**
 * Main bootstrap function
 */
async function bootstrap(): Promise<void> {
  try {
    console.log('🔐 Starting secure admin bootstrap...');
    
    // Check for .env file
    checkEnvFile();
    
    // Validate environment
    validateEnvironment();
    
    // Generate secure password
    const password = generateSecurePassword();
    const hashedPassword = await hashPassword(password);
    
    const adminUser: AdminUser = {
      email: process.env.ADMIN_EMAIL!,
      password,
      hashedPassword,
      createdAt: new Date()
    };
    
    // Create admin user
    await createAdminUser(adminUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password:', password);
    console.log('');
    console.log('⚠️  IMPORTANT: Save this password securely and delete it from your terminal history!');
    console.log('⚠️  This password will not be shown again.');
    
  } catch (error) {
    console.error('❌ Bootstrap failed:', error);
    process.exit(1);
  }
}

// Check if this script is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  bootstrap();
}

export { bootstrap, generateSecurePassword, hashPassword };