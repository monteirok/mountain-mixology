import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import nodemailer from 'nodemailer';
import { externalServiceConfig } from './mcp-config.js';
import { storage } from '../server/storage.js';

const server = new Server(
  {
    name: 'mountain-mixology-email',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

const gmailTransporter = externalServiceConfig.email.gmail.enabled ? nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: externalServiceConfig.email.gmail.user,
    pass: externalServiceConfig.email.gmail.appPassword,
  },
}) : null;

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

const emailTemplates: Record<string, EmailTemplate> = {
  welcome: {
    subject: 'Thank you for your interest in Mountain Mixology!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50;">Thank You for Your Inquiry!</h1>
        <p>Dear {{firstName}},</p>
        <p>Thank you for reaching out to Mountain Mixology! We're excited about the possibility of creating an unforgettable beverage experience for your {{eventType}}.</p>
        <p>We've received your inquiry and will be in touch within 24 hours to discuss:</p>
        <ul>
          <li>Your event details and vision</li>
          <li>Customized cocktail menu options</li>
          <li>Pricing and package details</li>
          <li>Next steps in the planning process</li>
        </ul>
        <p>In the meantime, feel free to browse our <a href="https://mountainmixology.com/gallery">gallery</a> for inspiration!</p>
        <p>Cheers,<br>The Mountain Mixology Team</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          Mountain Mixology | Premium Cocktail Catering<br>
          Creating elevated beverage experiences across Colorado
        </p>
      </div>
    `,
    text: `Dear {{firstName}},

Thank you for reaching out to Mountain Mixology! We're excited about the possibility of creating an unforgettable beverage experience for your {{eventType}}.

We've received your inquiry and will be in touch within 24 hours to discuss:
- Your event details and vision
- Customized cocktail menu options
- Pricing and package details
- Next steps in the planning process

In the meantime, feel free to browse our gallery for inspiration at https://mountainmixology.com/gallery

Cheers,
The Mountain Mixology Team

Mountain Mixology | Premium Cocktail Catering
Creating elevated beverage experiences across Colorado`
  },
  
  follow_up: {
    subject: 'Following up on your Mountain Mixology inquiry',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50;">Let's Create Something Amazing Together!</h1>
        <p>Hi {{firstName}},</p>
        <p>I wanted to follow up on your recent inquiry about our cocktail catering services for your {{eventType}}.</p>
        <p>Based on your requirements:</p>
        <ul>
          <li><strong>Event Date:</strong> {{eventDate}}</li>
          <li><strong>Guest Count:</strong> {{guestCount}} guests</li>
          <li><strong>Location:</strong> {{location}}</li>
          <li><strong>Budget Range:</strong> {{budget}}</li>
        </ul>
        <p>I'd love to schedule a brief call to discuss your vision and how we can bring it to life. We specialize in creating custom cocktail experiences that perfectly match your event's style and atmosphere.</p>
        <p>Would you be available for a 15-minute call this week? You can <a href="https://calendly.com/mountain-mixology">book directly here</a> or simply reply with your preferred times.</p>
        <p>Looking forward to connecting!</p>
        <p>Best regards,<br>Sarah Johnson<br>Lead Mixologist & Events Coordinator</p>
      </div>
    `,
    text: `Hi {{firstName}},

I wanted to follow up on your recent inquiry about our cocktail catering services for your {{eventType}}.

Based on your requirements:
- Event Date: {{eventDate}}
- Guest Count: {{guestCount}} guests
- Location: {{location}}
- Budget Range: {{budget}}

I'd love to schedule a brief call to discuss your vision and how we can bring it to life. We specialize in creating custom cocktail experiences that perfectly match your event's style and atmosphere.

Would you be available for a 15-minute call this week? You can book directly at https://calendly.com/mountain-mixology or simply reply with your preferred times.

Looking forward to connecting!

Best regards,
Sarah Johnson
Lead Mixologist & Events Coordinator`
  },

  quote_sent: {
    subject: 'Your Custom Mountain Mixology Proposal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50;">Your Custom Cocktail Experience Awaits!</h1>
        <p>Hi {{firstName}},</p>
        <p>Thank you for taking the time to discuss your {{eventType}} with us. I'm excited to share our custom proposal tailored specifically for your event!</p>
        <p>Please find attached our detailed proposal which includes:</p>
        <ul>
          <li>Curated cocktail menu recommendations</li>
          <li>Professional bartending services</li>
          <li>Premium ingredients and garnishes</li>
          <li>Complete bar setup and breakdown</li>
          <li>Transparent pricing breakdown</li>
        </ul>
        <p>This proposal is valid for 14 days, and we're happy to make adjustments to ensure it perfectly fits your vision and budget.</p>
        <p>I'm available to answer any questions or discuss modifications. Let's make your event unforgettable!</p>
        <p>Cheers,<br>The Mountain Mixology Team</p>
      </div>
    `,
    text: `Hi {{firstName}},

Thank you for taking the time to discuss your {{eventType}} with us. I'm excited to share our custom proposal tailored specifically for your event!

Please find attached our detailed proposal which includes:
- Curated cocktail menu recommendations
- Professional bartending services
- Premium ingredients and garnishes
- Complete bar setup and breakdown
- Transparent pricing breakdown

This proposal is valid for 14 days, and we're happy to make adjustments to ensure it perfectly fits your vision and budget.

I'm available to answer any questions or discuss modifications. Let's make your event unforgettable!

Cheers,
The Mountain Mixology Team`
  },

  newsletter_welcome: {
    subject: 'Welcome to the Mountain Mixology Community!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50;">Welcome to Our Community!</h1>
        <p>Hi {{firstName}},</p>
        <p>Welcome to the Mountain Mixology newsletter! You're now part of an exclusive community of cocktail enthusiasts and event planners who appreciate the art of exceptional beverage experiences.</p>
        <p>Here's what you can expect from us:</p>
        <ul>
          <li>🍸 Seasonal cocktail recipes and trends</li>
          <li>🎉 Event planning tips and inspiration</li>
          <li>📸 Behind-the-scenes content from our events</li>
          <li>💰 Exclusive offers and early access to booking</li>
          <li>🥂 Stories from real weddings and celebrations</li>
        </ul>
        <p>As a welcome gift, enjoy 10% off your first booking with code: <strong>WELCOME10</strong></p>
        <p>Stay tuned for our monthly newsletter packed with cocktail inspiration!</p>
        <p>Cheers,<br>The Mountain Mixology Team</p>
      </div>
    `,
    text: `Hi {{firstName}},

Welcome to the Mountain Mixology newsletter! You're now part of an exclusive community of cocktail enthusiasts and event planners who appreciate the art of exceptional beverage experiences.

Here's what you can expect from us:
🍸 Seasonal cocktail recipes and trends
🎉 Event planning tips and inspiration
📸 Behind-the-scenes content from our events
💰 Exclusive offers and early access to booking
🥂 Stories from real weddings and celebrations

As a welcome gift, enjoy 10% off your first booking with code: WELCOME10

Stay tuned for our monthly newsletter packed with cocktail inspiration!

Cheers,
The Mountain Mixology Team`
  }
};

function replaceTemplateVariables(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] || match;
  });
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = [
    {
      name: 'sendWelcomeEmail',
      description: 'Send automated welcome email to new contact submission',
      inputSchema: {
        type: 'object',
        properties: {
          submissionId: { type: 'number' },
          templateOverride: { type: 'string' },
        },
        required: ['submissionId'],
      },
    },
    {
      name: 'sendFollowUpEmail',
      description: 'Send follow-up email for inquiry responses',
      inputSchema: {
        type: 'object',
        properties: {
          submissionId: { type: 'number' },
          delayDays: { type: 'number', default: 2 },
          customMessage: { type: 'string' },
        },
        required: ['submissionId'],
      },
    },
    {
      name: 'sendCustomEmail',
      description: 'Send custom email to a contact',
      inputSchema: {
        type: 'object',
        properties: {
          to: { type: 'string' },
          subject: { type: 'string' },
          html: { type: 'string' },
          text: { type: 'string' },
          attachments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                filename: { type: 'string' },
                path: { type: 'string' },
                contentType: { type: 'string' },
              },
            },
          },
        },
        required: ['to', 'subject'],
      },
    },
    {
      name: 'scheduleEmailSequence',
      description: 'Schedule a series of automated emails',
      inputSchema: {
        type: 'object',
        properties: {
          submissionId: { type: 'number' },
          sequenceType: {
            type: 'string',
            enum: ['nurture', 'follow_up', 'post_event'],
            default: 'nurture',
          },
        },
        required: ['submissionId'],
      },
    },
    {
      name: 'addToNewsletter',
      description: 'Add contact to newsletter subscription',
      inputSchema: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          sendWelcome: { type: 'boolean', default: true },
          source: { type: 'string', default: 'website' },
        },
        required: ['email'],
      },
    },
    {
      name: 'getEmailMetrics',
      description: 'Get email campaign performance metrics',
      inputSchema: {
        type: 'object',
        properties: {
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          templateType: { type: 'string' },
        },
      },
    },
  ];

  return { tools: gmailTransporter ? tools : [] };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (!gmailTransporter) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: 'Email service not configured' }),
        },
      ],
    };
  }

  const { name, arguments: args } = request.params as { name: string; arguments: any };

  try {
    switch (name) {
      case 'sendWelcomeEmail': {
        const { submissionId, templateOverride } = args;
        const submissions = await storage.getContactSubmissions();
        const submission = submissions.find(s => s.id === submissionId);
        
        if (!submission) {
          throw new Error('Submission not found');
        }

        const template = emailTemplates[templateOverride || 'welcome'];
        const variables = {
          firstName: submission.firstName,
          lastName: submission.lastName,
          eventType: submission.eventType || 'event',
          eventDate: submission.eventDate || 'TBD',
          guestCount: submission.guestCount || 'TBD',
          location: submission.location || 'TBD',
          budget: submission.budget || 'TBD',
        };

        const mailOptions = {
          from: externalServiceConfig.email.gmail.user,
          to: submission.email,
          subject: replaceTemplateVariables(template.subject, variables),
          html: replaceTemplateVariables(template.html, variables),
          text: replaceTemplateVariables(template.text, variables),
        };

        const result = await gmailTransporter.sendMail(mailOptions);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                messageId: result.messageId,
                to: submission.email,
                subject: mailOptions.subject,
              }),
            },
          ],
        };
      }

      case 'sendFollowUpEmail': {
        const { submissionId, delayDays = 2, customMessage } = args;
        const submissions = await storage.getContactSubmissions();
        const submission = submissions.find(s => s.id === submissionId);
        
        if (!submission) {
          throw new Error('Submission not found');
        }

        const template = emailTemplates.follow_up;
        const variables = {
          firstName: submission.firstName,
          lastName: submission.lastName,
          eventType: submission.eventType || 'event',
          eventDate: submission.eventDate || 'TBD',
          guestCount: submission.guestCount || 'TBD',
          location: submission.location || 'TBD',
          budget: submission.budget || 'TBD',
        };

        let emailContent = template;
        if (customMessage) {
          emailContent = {
            ...template,
            html: template.html.replace(
              'I wanted to follow up on your recent inquiry',
              customMessage
            ),
            text: template.text.replace(
              'I wanted to follow up on your recent inquiry',
              customMessage
            ),
          };
        }

        const mailOptions = {
          from: externalServiceConfig.email.gmail.user,
          to: submission.email,
          subject: replaceTemplateVariables(emailContent.subject, variables),
          html: replaceTemplateVariables(emailContent.html, variables),
          text: replaceTemplateVariables(emailContent.text, variables),
        };

        if (delayDays > 0) {
          setTimeout(async () => {
            await gmailTransporter.sendMail(mailOptions);
          }, delayDays * 24 * 60 * 60 * 1000);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  scheduled: true,
                  delayDays,
                  to: submission.email,
                  subject: mailOptions.subject,
                }),
              },
            ],
          };
        } else {
          const result = await gmailTransporter.sendMail(mailOptions);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  messageId: result.messageId,
                  to: submission.email,
                  subject: mailOptions.subject,
                }),
              },
            ],
          };
        }
      }

      case 'sendCustomEmail': {
        const { to, subject, html, text, attachments } = args;

        const mailOptions = {
          from: externalServiceConfig.email.gmail.user,
          to,
          subject,
          html: html || text,
          text: text || html?.replace(/<[^>]*>/g, ''),
          attachments: attachments || [],
        };

        const result = await gmailTransporter.sendMail(mailOptions);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                messageId: result.messageId,
                to,
                subject,
              }),
            },
          ],
        };
      }

      case 'scheduleEmailSequence': {
        const { submissionId, sequenceType = 'nurture' } = args;
        const submissions = await storage.getContactSubmissions();
        const submission = submissions.find(s => s.id === submissionId);
        
        if (!submission) {
          throw new Error('Submission not found');
        }

        const sequences = {
          nurture: [
            { template: 'welcome', delayDays: 0 },
            { template: 'follow_up', delayDays: 3 },
            { template: 'quote_sent', delayDays: 7 },
          ],
          follow_up: [
            { template: 'follow_up', delayDays: 1 },
            { template: 'follow_up', delayDays: 5 },
          ],
          post_event: [
            { template: 'newsletter_welcome', delayDays: 1 },
          ],
        };

        const sequence = sequences[sequenceType];
        const scheduledEmails = [];

        for (const step of sequence) {
          const template = emailTemplates[step.template];
          const variables = {
            firstName: submission.firstName,
            lastName: submission.lastName,
            eventType: submission.eventType || 'event',
            eventDate: submission.eventDate || 'TBD',
            guestCount: submission.guestCount || 'TBD',
            location: submission.location || 'TBD',
            budget: submission.budget || 'TBD',
          };

          const mailOptions = {
            from: externalServiceConfig.email.gmail.user,
            to: submission.email,
            subject: replaceTemplateVariables(template.subject, variables),
            html: replaceTemplateVariables(template.html, variables),
            text: replaceTemplateVariables(template.text, variables),
          };

          if (step.delayDays > 0) {
            setTimeout(async () => {
              await gmailTransporter.sendMail(mailOptions);
            }, step.delayDays * 24 * 60 * 60 * 1000);
          } else {
            await gmailTransporter.sendMail(mailOptions);
          }

          scheduledEmails.push({
            template: step.template,
            delayDays: step.delayDays,
            subject: mailOptions.subject,
            scheduledTime: new Date(Date.now() + step.delayDays * 24 * 60 * 60 * 1000).toISOString(),
          });
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                sequenceType,
                emailsScheduled: scheduledEmails.length,
                emails: scheduledEmails,
              }),
            },
          ],
        };
      }

      case 'addToNewsletter': {
        const { email, firstName, lastName, sendWelcome = true, source = 'website' } = args;

        if (sendWelcome) {
          const template = emailTemplates.newsletter_welcome;
          const variables = {
            firstName: firstName || 'Friend',
            lastName: lastName || '',
          };

          const mailOptions = {
            from: externalServiceConfig.email.gmail.user,
            to: email,
            subject: replaceTemplateVariables(template.subject, variables),
            html: replaceTemplateVariables(template.html, variables),
            text: replaceTemplateVariables(template.text, variables),
          };

          await gmailTransporter.sendMail(mailOptions);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                email,
                firstName,
                source,
                welcomeEmailSent: sendWelcome,
              }),
            },
          ],
        };
      }

      case 'getEmailMetrics': {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                metrics: {
                  totalSent: 0,
                  openRate: 0,
                  clickRate: 0,
                  bounceRate: 0,
                  note: 'Email metrics tracking would require integration with email service provider APIs',
                },
              }),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
          }),
        },
      ],
    };
  }
});

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: gmailTransporter ? [
      {
        uri: 'email://templates',
        mimeType: 'application/json',
        name: 'Email Templates',
        description: 'Available email templates for automation',
      },
      {
        uri: 'email://sent',
        mimeType: 'application/json',
        name: 'Sent Emails',
        description: 'History of sent automated emails',
      },
      {
        uri: 'email://newsletter',
        mimeType: 'application/json',
        name: 'Newsletter Subscribers',
        description: 'Newsletter subscription list',
      },
    ] : [],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (!gmailTransporter) {
    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: 'application/json',
          text: JSON.stringify({ error: 'Email service not configured' }),
        },
      ],
    };
  }

  const { uri } = request.params;

  switch (uri) {
    case 'email://templates': {
      const templateList = Object.keys(emailTemplates).map(key => ({
        name: key,
        subject: emailTemplates[key].subject,
        description: `Template for ${key.replace('_', ' ')} emails`,
      }));

      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(templateList, null, 2),
          },
        ],
      };
    }

    case 'email://sent': {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              note: 'Email history would be tracked in database in production',
              exampleSent: [],
            }, null, 2),
          },
        ],
      };
    }

    case 'email://newsletter': {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              note: 'Newsletter subscribers would be stored in database',
              subscribers: [],
            }, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);