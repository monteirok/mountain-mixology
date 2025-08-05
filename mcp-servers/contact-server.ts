import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { storage } from '../server/storage.js';
import { insertContactSubmissionSchema } from '../shared/schema.js';

const server = new Server(
  {
    name: 'mountain-mixology-contact',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'createContactSubmission',
        description: 'Create a new contact submission with validation',
        inputSchema: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            eventType: { type: 'string' },
            guestCount: { type: 'string' },
            eventDate: { type: 'string' },
            budget: { type: 'string' },
            location: { type: 'string' },
            message: { type: 'string' },
            newsletter: { type: 'string' },
          },
          required: ['firstName', 'lastName', 'email', 'eventType', 'message'],
        },
      },
      {
        name: 'getContactSubmissions',
        description: 'Get all contact submissions for admin dashboard',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number' },
            offset: { type: 'number' },
          },
        },
      },
      {
        name: 'scoreLeadQuality',
        description: 'Score lead quality based on budget and event type',
        inputSchema: {
          type: 'object',
          properties: {
            submissionId: { type: 'number' },
          },
          required: ['submissionId'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params as { name: string; arguments: any };

  switch (name) {
    case 'createContactSubmission': {
      try {
        const validatedData = insertContactSubmissionSchema.parse(args);
        const submission = await storage.createContactSubmission(validatedData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, submission }),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: error.message }),
            },
          ],
        };
      }
    }

    case 'getContactSubmissions': {
      const submissions = await storage.getContactSubmissions();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(submissions),
          },
        ],
      };
    }

    case 'scoreLeadQuality': {
      // Lead scoring logic
      const { submissionId } = args;
      const submissions = await storage.getContactSubmissions();
      const submission = submissions.find(s => s.id === submissionId);
      
      if (!submission) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: 'Submission not found' }),
            },
          ],
        };
      }

      let score = 0;
      
      // Budget scoring
      if (submission.budget?.includes('$10,000+')) score += 50;
      else if (submission.budget?.includes('$5,000-$10,000')) score += 30;
      else if (submission.budget?.includes('$2,500-$5,000')) score += 20;
      
      // Event type scoring
      if (submission.eventType === 'wedding') score += 30;
      else if (submission.eventType === 'corporate') score += 25;
      else if (submission.eventType === 'private') score += 20;
      
      // Guest count scoring
      const guestCount = parseInt(submission.guestCount || '0');
      if (guestCount > 100) score += 20;
      else if (guestCount > 50) score += 15;
      else if (guestCount > 25) score += 10;

      const quality = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ score, quality, submissionId }),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'contact://submissions',
        mimeType: 'application/json',
        name: 'All Contact Submissions',
        description: 'Complete list of contact form submissions',
      },
      {
        uri: 'contact://leads/high-value',
        mimeType: 'application/json',
        name: 'High-Value Leads',
        description: 'Premium leads with high conversion potential',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'contact://submissions': {
      const submissions = await storage.getContactSubmissions();
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(submissions, null, 2),
          },
        ],
      };
    }

    case 'contact://leads/high-value': {
      const submissions = await storage.getContactSubmissions();
      const highValueLeads = submissions.filter(submission => {
        let score = 0;
        if (submission.budget?.includes('$10,000+')) score += 50;
        if (submission.eventType === 'wedding') score += 30;
        const guestCount = parseInt(submission.guestCount || '0');
        if (guestCount > 100) score += 20;
        return score >= 70;
      });

      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(highValueLeads, null, 2),
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
