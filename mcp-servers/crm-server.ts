import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { Client } from '@hubspot/api-client';
import { externalServiceConfig } from './mcp-config.js';
import { storage } from '../server/storage.js';

const hubspotClient = externalServiceConfig.hubspot.enabled 
  ? new Client({ accessToken: externalServiceConfig.hubspot.apiKey })
  : null;

const server = new Server(
  {
    name: 'mountain-mixology-crm',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  eventType?: string;
  guestCount?: string;
  eventDate?: string;
  budget?: string;
  location?: string;
  message?: string;
  leadScore?: number;
  leadQuality?: 'high' | 'medium' | 'low';
}

interface HubSpotDeal {
  dealname: string;
  dealstage: string;
  amount?: string;
  closedate?: string;
  pipeline: string;
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = [
    {
      name: 'syncContactToHubSpot',
      description: 'Sync a contact submission to HubSpot CRM',
      inputSchema: {
        type: 'object',
        properties: {
          submissionId: { type: 'number' },
          overwrite: { type: 'boolean', default: false },
        },
        required: ['submissionId'],
      },
    },
    {
      name: 'createHubSpotDeal',
      description: 'Create a deal in HubSpot from a contact submission',
      inputSchema: {
        type: 'object',
        properties: {
          submissionId: { type: 'number' },
          dealStage: { 
            type: 'string',
            enum: ['appointmentscheduled', 'qualifiedtobuy', 'presentationscheduled', 'decisionmakerboughtin', 'contractsent', 'closedwon', 'closedlost'],
            default: 'appointmentscheduled'
          },
          customAmount: { type: 'string' },
        },
        required: ['submissionId'],
      },
    },
    {
      name: 'updateLeadScore',
      description: 'Update lead score for a HubSpot contact',
      inputSchema: {
        type: 'object',
        properties: {
          hubspotContactId: { type: 'string' },
          score: { type: 'number' },
          quality: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
        required: ['hubspotContactId', 'score'],
      },
    },
    {
      name: 'getHubSpotContacts',
      description: 'Retrieve contacts from HubSpot with optional filtering',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 100 },
          leadQuality: { type: 'string', enum: ['high', 'medium', 'low'] },
          eventType: { type: 'string' },
        },
      },
    },
    {
      name: 'setupFollowUpSequence',
      description: 'Set up automated follow-up sequence for a contact',
      inputSchema: {
        type: 'object',
        properties: {
          hubspotContactId: { type: 'string' },
          sequenceType: { 
            type: 'string',
            enum: ['initial_inquiry', 'quote_sent', 'follow_up_reminder', 'post_event'],
            default: 'initial_inquiry'
          },
        },
        required: ['hubspotContactId'],
      },
    },
  ];

  return { tools: hubspotClient ? tools : [] };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (!hubspotClient) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: 'HubSpot integration not configured' }),
        },
      ],
    };
  }

  const { name, arguments: args } = request.params as { name: string; arguments: any };

  try {
    switch (name) {
      case 'syncContactToHubSpot': {
        const { submissionId, overwrite = false } = args;
        const submissions = await storage.getContactSubmissions();
        const submission = submissions.find(s => s.id === submissionId);
        
        if (!submission) {
          throw new Error('Submission not found');
        }

        const contactData: ContactData = {
          firstName: submission.firstName,
          lastName: submission.lastName,
          email: submission.email,
          phone: submission.phone || undefined,
          eventType: submission.eventType,
          guestCount: submission.guestCount || undefined,
          eventDate: submission.eventDate || undefined,
          budget: submission.budget || undefined,
          location: submission.location || undefined,
          message: submission.message,
        };

        const hubspotProperties = {
          firstname: contactData.firstName,
          lastname: contactData.lastName,
          email: contactData.email,
          phone: contactData.phone,
          event_type: contactData.eventType,
          guest_count: contactData.guestCount,
          event_date: contactData.eventDate,
          budget_range: contactData.budget,
          event_location: contactData.location,
          initial_message: contactData.message,
          lead_source: 'Website Contact Form',
          lifecyclestage: 'lead',
        };

        let hubspotContact;
        
        try {
          const existingContact = await hubspotClient.crm.contacts.basicApi.getById(
            submission.email,
            undefined,
            undefined,
            undefined,
            false,
            'email'
          );
          
          if (overwrite) {
            hubspotContact = await hubspotClient.crm.contacts.basicApi.update(
              existingContact.id,
              { properties: hubspotProperties }
            );
          } else {
            hubspotContact = existingContact;
          }
        } catch (error) {
          hubspotContact = await hubspotClient.crm.contacts.basicApi.create({
            properties: hubspotProperties,
          });
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                hubspotContactId: hubspotContact.id,
                action: overwrite ? 'updated' : 'created',
              }),
            },
          ],
        };
      }

      case 'createHubSpotDeal': {
        const { submissionId, dealStage = 'appointmentscheduled', customAmount } = args;
        const submissions = await storage.getContactSubmissions();
        const submission = submissions.find(s => s.id === submissionId);
        
        if (!submission) {
          throw new Error('Submission not found');
        }

        let hubspotContactId;
        try {
          const contact = await hubspotClient.crm.contacts.basicApi.getById(
            submission.email,
            undefined,
            undefined,
            undefined,
            false,
            'email'
          );
          hubspotContactId = contact.id;
        } catch (error) {
          const newContact = await hubspotClient.crm.contacts.basicApi.create({
            properties: {
              firstname: submission.firstName,
              lastname: submission.lastName,
              email: submission.email,
              phone: submission.phone,
              event_type: submission.eventType,
              guest_count: submission.guestCount,
              event_date: submission.eventDate,
              budget_range: submission.budget,
              event_location: submission.location,
              initial_message: submission.message,
              lead_source: 'Website Contact Form',
              lifecyclestage: 'lead',
            },
          });
          hubspotContactId = newContact.id;
        }

        const dealName = `${submission.firstName} ${submission.lastName} - ${submission.eventType || 'Event'}`;
        const dealAmount = customAmount || (submission.budget?.match(/\$[\d,]+/) ? submission.budget.match(/\$[\d,]+/)[0].replace(/[,$]/g, '') : undefined);
        
        const dealProperties: HubSpotDeal = {
          dealname: dealName,
          dealstage: dealStage,
          amount: dealAmount,
          closedate: submission.eventDate ? new Date(submission.eventDate).getTime().toString() : undefined,
          pipeline: 'default',
        };

        const deal = await hubspotClient.crm.deals.basicApi.create({
          properties: dealProperties,
        });

        await hubspotClient.crm.deals.associationsApi.create(
          deal.id,
          'contacts',
          hubspotContactId,
          'deal_to_contact'
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                dealId: deal.id,
                contactId: hubspotContactId,
                dealName,
                amount: dealAmount,
              }),
            },
          ],
        };
      }

      case 'updateLeadScore': {
        const { hubspotContactId, score, quality } = args;
        
        await hubspotClient.crm.contacts.basicApi.update(hubspotContactId, {
          properties: {
            hs_lead_score: score.toString(),
            lead_quality: quality,
            last_score_update: new Date().toISOString(),
          },
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                contactId: hubspotContactId,
                score,
                quality,
              }),
            },
          ],
        };
      }

      case 'getHubSpotContacts': {
        const { limit = 100, leadQuality, eventType } = args;
        
        const filterGroups = [];
        if (leadQuality) {
          filterGroups.push({
            filters: [{
              propertyName: 'lead_quality',
              operator: 'EQ',
              value: leadQuality,
            }]
          });
        }
        if (eventType) {
          filterGroups.push({
            filters: [{
              propertyName: 'event_type',
              operator: 'EQ',
              value: eventType,
            }]
          });
        }

        const searchRequest = {
          limit,
          filterGroups: filterGroups.length > 0 ? filterGroups : undefined,
          sorts: [{ propertyName: 'createdate', direction: 'DESCENDING' }],
          properties: [
            'firstname', 'lastname', 'email', 'phone', 'event_type', 
            'guest_count', 'event_date', 'budget_range', 'lead_quality', 
            'hs_lead_score', 'lifecyclestage', 'createdate'
          ],
        };

        const response = await hubspotClient.crm.contacts.searchApi.doSearch(searchRequest);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                contacts: response.results,
                total: response.total,
              }),
            },
          ],
        };
      }

      case 'setupFollowUpSequence': {
        const { hubspotContactId, sequenceType = 'initial_inquiry' } = args;
        
        const sequences = {
          initial_inquiry: {
            tasks: [
              { title: 'Send welcome email', delayDays: 0 },
              { title: 'Follow up call', delayDays: 2 },
              { title: 'Send pricing info', delayDays: 5 },
            ],
          },
          quote_sent: {
            tasks: [
              { title: 'Follow up on quote', delayDays: 3 },
              { title: 'Schedule consultation call', delayDays: 7 },
              { title: 'Send alternative options', delayDays: 14 },
            ],
          },
          follow_up_reminder: {
            tasks: [
              { title: 'Check in call', delayDays: 1 },
              { title: 'Send additional info', delayDays: 5 },
            ],
          },
          post_event: {
            tasks: [
              { title: 'Send thank you note', delayDays: 1 },
              { title: 'Request review/testimonial', delayDays: 7 },
              { title: 'Add to newsletter list', delayDays: 14 },
            ],
          },
        };

        const sequence = sequences[sequenceType];
        const tasks = [];

        for (const task of sequence.tasks) {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + task.delayDays);

          const taskResult = await hubspotClient.crm.objects.tasks.basicApi.create({
            properties: {
              hs_task_subject: task.title,
              hs_task_body: `Automated follow-up task for ${sequenceType} sequence`,
              hs_task_status: 'NOT_STARTED',
              hs_task_priority: 'MEDIUM',
              hs_timestamp: dueDate.getTime().toString(),
            },
          });

          await hubspotClient.crm.objects.tasks.associationsApi.create(
            taskResult.id,
            'contacts',
            hubspotContactId,
            'task_to_contact'
          );

          tasks.push({
            id: taskResult.id,
            title: task.title,
            dueDate: dueDate.toISOString(),
          });
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                contactId: hubspotContactId,
                sequenceType,
                tasksCreated: tasks.length,
                tasks,
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
    resources: hubspotClient ? [
      {
        uri: 'crm://contacts',
        mimeType: 'application/json',
        name: 'HubSpot Contacts',
        description: 'All contacts synced to HubSpot CRM',
      },
      {
        uri: 'crm://deals',
        mimeType: 'application/json',
        name: 'HubSpot Deals',
        description: 'All deals in the sales pipeline',
      },
      {
        uri: 'crm://high-value-leads',
        mimeType: 'application/json',
        name: 'High-Value Leads',
        description: 'High-scoring leads requiring priority follow-up',
      },
    ] : [],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (!hubspotClient) {
    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: 'application/json',
          text: JSON.stringify({ error: 'HubSpot integration not configured' }),
        },
      ],
    };
  }

  const { uri } = request.params;

  try {
    switch (uri) {
      case 'crm://contacts': {
        const response = await hubspotClient.crm.contacts.basicApi.getPage(100);
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(response.results, null, 2),
            },
          ],
        };
      }

      case 'crm://deals': {
        const response = await hubspotClient.crm.deals.basicApi.getPage(100);
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(response.results, null, 2),
            },
          ],
        };
      }

      case 'crm://high-value-leads': {
        const searchRequest = {
          filterGroups: [{
            filters: [{
              propertyName: 'lead_quality',
              operator: 'EQ',
              value: 'high',
            }]
          }],
          properties: [
            'firstname', 'lastname', 'email', 'phone', 'event_type',
            'guest_count', 'budget_range', 'hs_lead_score', 'createdate'
          ],
          sorts: [{ propertyName: 'hs_lead_score', direction: 'DESCENDING' }],
          limit: 50,
        };

        const response = await hubspotClient.crm.contacts.searchApi.doSearch(searchRequest);
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(response.results, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown resource: ${uri}`);
    }
  } catch (error) {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
          }),
        },
      ],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);