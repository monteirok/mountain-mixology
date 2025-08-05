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
    name: 'mountain-mixology-calendar',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Mock booking data - in production, integrate with Google Calendar API
const bookings = [
  {
    id: 1,
    date: '2024-06-15',
    eventType: 'wedding',
    clientName: 'Smith Wedding',
    status: 'confirmed',
  },
  {
    id: 2,
    date: '2024-07-20',
    eventType: 'corporate',
    clientName: 'Tech Corp Event',
    status: 'pending',
  },
];

const blockedDates = ['2024-12-25', '2024-01-01']; // Holidays

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'checkAvailability',
        description: 'Check date availability for events',
        inputSchema: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date' },
            eventType: { type: 'string' },
            duration: { type: 'number', default: 4 },
          },
          required: ['date'],
        },
      },
      {
        name: 'blockDates',
        description: 'Block dates for maintenance or holidays',
        inputSchema: {
          type: 'object',
          properties: {
            dates: { type: 'array', items: { type: 'string', format: 'date' } },
            reason: { type: 'string' },
          },
          required: ['dates'],
        },
      },
      {
        name: 'suggestAlternatives',
        description: 'Suggest alternative dates when requested date is unavailable',
        inputSchema: {
          type: 'object',
          properties: {
            requestedDate: { type: 'string', format: 'date' },
            eventType: { type: 'string' },
            flexibility: { type: 'number', default: 14 }, // days
          },
          required: ['requestedDate'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'checkAvailability': {
      const { date, eventType, duration = 4 } = args;
      
      const isBlocked = blockedDates.includes(date);
      const existingBooking = bookings.find(b => b.date === date);
      const isWeekend = new Date(date).getDay() % 6 === 0; // Saturday or Sunday
      
      const availability = {
        date,
        available: !isBlocked && !existingBooking,
        reason: isBlocked ? 'blocked_date' : 
                existingBooking ? 'already_booked' : 
                'available',
        isWeekend,
        premiumPricing: isWeekend,
        conflictingEvent: existingBooking || null,
        seasonalPricing: getSeason(date),
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(availability, null, 2),
          },
        ],
      };
    }

    case 'blockDates': {
      const { dates, reason = 'maintenance' } = args;
      
      dates.forEach(date => {
        if (!blockedDates.includes(date)) {
          blockedDates.push(date);
        }
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              blockedDates: dates,
              reason,
              totalBlocked: blockedDates.length,
            }),
          },
        ],
      };
    }

    case 'suggestAlternatives': {
      const { requestedDate, eventType, flexibility = 14 } = args;
      
      const alternatives = [];
      const baseDate = new Date(requestedDate);
      
      // Check dates within flexibility range
      for (let i = 1; i <= flexibility; i++) {
        // Check before requested date
        const beforeDate = new Date(baseDate);
        beforeDate.setDate(baseDate.getDate() - i);
        const beforeDateStr = beforeDate.toISOString().split('T')[0];
        
        if (!blockedDates.includes(beforeDateStr) && 
            !bookings.find(b => b.date === beforeDateStr)) {
          alternatives.push({
            date: beforeDateStr,
            daysDifference: -i,
            isWeekend: beforeDate.getDay() % 6 === 0,
            season: getSeason(beforeDateStr),
          });
        }
        
        // Check after requested date
        const afterDate = new Date(baseDate);
        afterDate.setDate(baseDate.getDate() + i);
        const afterDateStr = afterDate.toISOString().split('T')[0];
        
        if (!blockedDates.includes(afterDateStr) && 
            !bookings.find(b => b.date === afterDateStr)) {
          alternatives.push({
            date: afterDateStr,
            daysDifference: i,
            isWeekend: afterDate.getDay() % 6 === 0,
            season: getSeason(afterDateStr),
          });
        }
      }

      // Sort by proximity to requested date
      alternatives.sort((a, b) => Math.abs(a.daysDifference) - Math.abs(b.daysDifference));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              requestedDate,
              alternatives: alternatives.slice(0, 5), // Top 5 alternatives
              totalFound: alternatives.length,
            }, null, 2),
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
        uri: 'calendar://availability',
        mimeType: 'application/json',
        name: 'Real-time Availability',
        description: 'Current calendar availability and bookings',
      },
      {
        uri: 'calendar://bookings',
        mimeType: 'application/json',
        name: 'Confirmed Events',
        description: 'All confirmed event bookings',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'calendar://availability': {
      const now = new Date();
      const nextThreeMonths = [];
      
      for (let i = 0; i < 90; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const isAvailable = !blockedDates.includes(dateStr) && 
                           !bookings.find(b => b.date === dateStr);
        
        nextThreeMonths.push({
          date: dateStr,
          available: isAvailable,
          isWeekend: date.getDay() % 6 === 0,
          season: getSeason(dateStr),
        });
      }

      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              period: '90_days',
              availability: nextThreeMonths,
              blockedDates,
              totalAvailable: nextThreeMonths.filter(d => d.available).length,
            }, null, 2),
          },
        ],
      };
    }

    case 'calendar://bookings': {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              bookings,
              totalBookings: bookings.length,
              upcomingBookings: bookings.filter(
                b => new Date(b.date) > new Date()
              ).length,
            }, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

function getSeason(dateStr: string): string {
  const month = new Date(dateStr).getMonth() + 1;
  if (month >= 6 && month <= 8) return 'peak';
  if (month >= 3 && month <= 5 || month >= 9 && month <= 11) return 'standard';
  return 'off';
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
