import * as dotenv from 'dotenv';

dotenv.config();

export interface MCPServerConfig {
  name: string;
  version: string;
  description: string;
  enabled: boolean;
  dependencies?: string[];
}

export interface ExternalServiceConfig {
  hubspot: {
    apiKey: string;
    enabled: boolean;
  };
  stripe: {
    secretKey: string;
    publishableKey: string;
    enabled: boolean;
  };
  google: {
    clientId: string;
    clientSecret: string;
    calendarId: string;
    enabled: boolean;
  };
  email: {
    gmail: {
      user: string;
      appPassword: string;
      enabled: boolean;
    };
    mailchimp: {
      apiKey: string;
      listId: string;
      enabled: boolean;
    };
  };
  slack: {
    botToken: string;
    channelId: string;
    enabled: boolean;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    enabled: boolean;
  };
}

export const mcpServerConfigs: Record<string, MCPServerConfig> = {
  contact: {
    name: 'mountain-mixology-contact',
    version: '1.0.0',
    description: 'Handle contact submissions, lead scoring, follow-up automation',
    enabled: true,
  },
  crm: {
    name: 'mountain-mixology-crm',
    version: '1.0.0',
    description: 'HubSpot CRM integration for lead management',
    enabled: !!process.env.HUBSPOT_API_KEY,
    dependencies: ['contact'],
  },
  calendar: {
    name: 'mountain-mixology-calendar',
    version: '1.0.0',
    description: 'Google Calendar integration for availability and booking',
    enabled: !!process.env.GOOGLE_CLIENT_ID,
  },
  payment: {
    name: 'mountain-mixology-payment',
    version: '1.0.0',
    description: 'Stripe payment processing for deposits and invoices',
    enabled: !!process.env.STRIPE_SECRET_KEY,
  },
  email: {
    name: 'mountain-mixology-email',
    version: '1.0.0',
    description: 'Email automation and newsletter management',
    enabled: !!process.env.GMAIL_USER || !!process.env.MAILCHIMP_API_KEY,
    dependencies: ['contact'],
  },
  analytics: {
    name: 'mountain-mixology-analytics',
    version: '1.0.0',
    description: 'Business analytics and performance tracking',
    enabled: true,
    dependencies: ['contact', 'crm'],
  },
  content: {
    name: 'mountain-mixology-content',
    version: '1.0.0',
    description: 'Content management and image optimization',
    enabled: !!process.env.CLOUDINARY_CLOUD_NAME,
  },
  communication: {
    name: 'mountain-mixology-communication',
    version: '1.0.0',
    description: 'Slack notifications and team coordination',
    enabled: !!process.env.SLACK_BOT_TOKEN,
    dependencies: ['contact'],
  },
  quote: {
    name: 'mountain-mixology-quote',
    version: '1.0.0',
    description: 'Automated quote generation and proposal system',
    enabled: true,
    dependencies: ['contact', 'calendar'],
  },
  inventory: {
    name: 'mountain-mixology-inventory',
    version: '1.0.0',
    description: 'Ingredient and equipment inventory management',
    enabled: true,
  },
  seo: {
    name: 'mountain-mixology-seo',
    version: '1.0.0',
    description: 'SEO optimization and social media integration',
    enabled: true,
    dependencies: ['content'],
  },
};

export const externalServiceConfig: ExternalServiceConfig = {
  hubspot: {
    apiKey: process.env.HUBSPOT_API_KEY || '',
    enabled: !!process.env.HUBSPOT_API_KEY,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    enabled: !!process.env.STRIPE_SECRET_KEY,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    calendarId: process.env.GOOGLE_CALENDAR_ID || '',
    enabled: !!process.env.GOOGLE_CLIENT_ID,
  },
  email: {
    gmail: {
      user: process.env.GMAIL_USER || '',
      appPassword: process.env.GMAIL_APP_PASSWORD || '',
      enabled: !!process.env.GMAIL_USER,
    },
    mailchimp: {
      apiKey: process.env.MAILCHIMP_API_KEY || '',
      listId: process.env.MAILCHIMP_LIST_ID || '',
      enabled: !!process.env.MAILCHIMP_API_KEY,
    },
  },
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN || '',
    channelId: process.env.SLACK_CHANNEL_ID || '',
    enabled: !!process.env.SLACK_BOT_TOKEN,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    enabled: !!process.env.CLOUDINARY_CLOUD_NAME,
  },
};

export function getEnabledServers(): string[] {
  return Object.keys(mcpServerConfigs).filter(
    (serverName) => mcpServerConfigs[serverName]?.enabled
  );
}

export function validateServerDependencies(serverName: string): boolean {
  const config = mcpServerConfigs[serverName];
  if (!config || !config.dependencies) return true;

  return config.dependencies.every((dep) => mcpServerConfigs[dep]?.enabled);
}

export function getServerInitializationOrder(): string[] {
  const enabledServers = getEnabledServers();
  const ordered: string[] = [];
  const processed = new Set<string>();

  function addServer(serverName: string) {
    if (processed.has(serverName)) return;
    
    const config = mcpServerConfigs[serverName];
    if (!config || !enabledServers.includes(serverName)) return;

    if (config.dependencies) {
      config.dependencies.forEach(addServer);
    }

    ordered.push(serverName);
    processed.add(serverName);
  }

  enabledServers.forEach(addServer);
  return ordered;
}