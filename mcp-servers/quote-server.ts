import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  {
    name: 'mountain-mixology-quotes',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Pricing structure
const PRICING = {
  baseRates: {
    wedding: 150,
    corporate: 120,
    private: 100,
    destination: 200,
  } as Record<string, number>,
  guestMultipliers: {
    '1-25': 1.0,
    '26-50': 0.9,
    '51-100': 0.8,
    '100+': 0.75,
  },
  seasonalMultipliers: {
    peak: 1.3, // June-September
    standard: 1.0, // March-May, October-November
    off: 0.8, // December-February
  },
};

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'calculateQuote',
        description: 'Calculate pricing based on event details',
        inputSchema: {
          type: 'object',
          properties: {
            eventType: { type: 'string', enum: ['wedding', 'corporate', 'private', 'destination'] },
            guestCount: { type: 'string' },
            eventDate: { type: 'string' },
            duration: { type: 'number', default: 4 },
            premiumPackage: { type: 'boolean', default: false },
          },
          required: ['eventType', 'guestCount'],
        },
      },
      {
        name: 'generateProposal',
        description: 'Generate detailed proposal document',
        inputSchema: {
          type: 'object',
          properties: {
            quote: { type: 'object' },
            clientInfo: { type: 'object' },
            customizations: { type: 'array' },
          },
          required: ['quote', 'clientInfo'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'calculateQuote': {
      const { eventType, guestCount, eventDate, duration = 4, premiumPackage = false } = args;
      
      // Base rate
      let baseRate = PRICING.baseRates[eventType] || PRICING.baseRates.private;
      
      // Guest count multiplier
      const guestNum = parseInt(guestCount) || 25;
      let guestMultiplier = 1.0;
      if (guestNum <= 25) guestMultiplier = PRICING.guestMultipliers['1-25'];
      else if (guestNum <= 50) guestMultiplier = PRICING.guestMultipliers['26-50'];
      else if (guestNum <= 100) guestMultiplier = PRICING.guestMultipliers['51-100'];
      else guestMultiplier = PRICING.guestMultipliers['100+'];
      
      // Seasonal pricing
      let seasonalMultiplier = PRICING.seasonalMultipliers.standard;
      if (eventDate) {
        const date = new Date(eventDate);
        const month = date.getMonth() + 1;
        if (month >= 6 && month <= 9) seasonalMultiplier = PRICING.seasonalMultipliers.peak;
        else if (month >= 12 || month <= 2) seasonalMultiplier = PRICING.seasonalMultipliers.off;
      }
      
      // Calculate total
      let subtotal = baseRate * guestNum * guestMultiplier * seasonalMultiplier * duration;
      
      // Premium package
      if (premiumPackage) subtotal *= 1.5;
      
      const tax = subtotal * 0.08; // 8% tax
      const total = subtotal + tax;
      
      const quote = {
        eventType,
        guestCount: guestNum,
        duration,
        baseRate,
        subtotal: Math.round(subtotal),
        tax: Math.round(tax),
        total: Math.round(total),
        breakdown: {
          baseRate,
          guestMultiplier,
          seasonalMultiplier,
          premiumPackage,
        },
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(quote, null, 2),
          },
        ],
      };
    }

    case 'generateProposal': {
      const { quote, clientInfo, customizations = [] } = args;
      
      const proposal = {
        id: `PROP-${Date.now()}`,
        clientInfo,
        quote,
        customizations,
        terms: {
          deposit: Math.round(quote.total * 0.3), // 30% deposit
          balance: Math.round(quote.total * 0.7),
          cancellationPolicy: '72 hours notice required',
          paymentTerms: 'Net 15',
        },
        inclusions: [
          'Professional bartender service',
          'Premium spirits and mixers',
          'Custom cocktail menu design',
          'Bar setup and breakdown',
          'Glassware and bar tools',
          'Ice and garnishes',
        ],
        addOns: [
          'Additional bartender: $200/event',
          'Premium glassware upgrade: $3/guest',
          'Signature cocktail creation: $150',
          'Late night service (after 11pm): $100/hour',
        ],
        generatedAt: new Date().toISOString(),
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(proposal, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'quotes://pricing',
        mimeType: 'application/json',
        name: 'Service Rate Cards',
        description: 'Current pricing structure and rates',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'quotes://pricing') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(PRICING, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
