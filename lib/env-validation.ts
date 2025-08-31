/**
 * Environment Variable Validation
 * 
 * Validates required environment variables at startup to prevent
 * runtime errors and security misconfigurations.
 * 
 * Security features:
 * - Validates all required environment variables
 * - Provides clear error messages for missing variables
 * - Type-safe environment variable access
 * - Sanitizes sensitive values in logs
 */

import { z } from 'zod';

// Define the schema for required environment variables
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  
  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  EXPRESS_SERVER_URL: z.string().url('Express server URL must be a valid URL').optional(),
  
  // Authentication & Security
  SESSION_SECRET: z.string().min(32, 'Session secret must be at least 32 characters long'),
  
  // Admin Configuration
  ADMIN_EMAIL: z.string().email('Admin email must be a valid email address'),
  
  // External Services (optional in development)
  HUBSPOT_API_KEY: z.string().optional(),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  
  // Google Services
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALENDAR_ID: z.string().optional(),
  
  // Email Services
  GMAIL_USER: z.string().email().optional(),
  GMAIL_APP_PASSWORD: z.string().optional(),
  MAILCHIMP_API_KEY: z.string().optional(),
  MAILCHIMP_LIST_ID: z.string().optional(),
  
  // Slack Integration
  SLACK_BOT_TOKEN: z.string().optional(),
  SLACK_CHANNEL_ID: z.string().optional(),
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

export type Environment = z.infer<typeof envSchema>;

/**
 * Validates environment variables against the schema
 */
export function validateEnvironment(): Environment {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    );
    
    console.error('❌ Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    
    throw new Error('Environment validation failed. Please check your .env file.');
  }
  
  return result.data;
}

/**
 * Gets validated environment variables
 */
export function getEnv(): Environment {
  return validateEnvironment();
}

/**
 * Validates production-specific requirements
 */
export function validateProductionEnvironment(): void {
  const env = validateEnvironment();
  
  if (env.NODE_ENV === 'production') {
    const required = [
      'STRIPE_SECRET_KEY',
      'STRIPE_PUBLISHABLE_KEY',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'GMAIL_USER',
      'GMAIL_APP_PASSWORD'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(
        `Production deployment requires these environment variables: ${missing.join(', ')}`
      );
    }
  }
}

/**
 * Logs safe environment information (no sensitive data)
 */
export function logEnvironmentInfo(): void {
  const env = validateEnvironment();
  
  console.log('🔧 Environment Configuration:');
  console.log(`  - NODE_ENV: ${env.NODE_ENV}`);
  console.log(`  - Database: ${env.DATABASE_URL ? '✅ Configured' : '❌ Missing'}`);
  console.log(`  - Session Secret: ${env.SESSION_SECRET ? '✅ Configured' : '❌ Missing'}`);
  console.log(`  - Admin Email: ${env.ADMIN_EMAIL}`);
  
  // Log external service status without exposing keys
  const services = [
    { name: 'HubSpot', key: 'HUBSPOT_API_KEY' },
    { name: 'Stripe', key: 'STRIPE_SECRET_KEY' },
    { name: 'Google Services', key: 'GOOGLE_CLIENT_ID' },
    { name: 'Gmail', key: 'GMAIL_USER' },
    { name: 'Mailchimp', key: 'MAILCHIMP_API_KEY' },
    { name: 'Slack', key: 'SLACK_BOT_TOKEN' },
    { name: 'Cloudinary', key: 'CLOUDINARY_CLOUD_NAME' },
  ];
  
  console.log('🔌 External Services:');
  services.forEach(service => {
    const configured = process.env[service.key] ? '✅' : '❌';
    console.log(`  - ${service.name}: ${configured}`);
  });
}