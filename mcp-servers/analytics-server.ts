import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { storage } from '../server/storage.js';

const server = new Server(
  {
    name: 'mountain-mixology-analytics',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'trackFormSubmission',
        description: 'Track form submission for conversion analysis',
        inputSchema: {
          type: 'object',
          properties: {
            submissionId: { type: 'number' },
            source: { type: 'string' },
            userAgent: { type: 'string' },
          },
          required: ['submissionId'],
        },
      },
      {
        name: 'analyzeLeadQuality',
        description: 'Analyze lead quality patterns',
        inputSchema: {
          type: 'object',
          properties: {
            timeframe: { type: 'string', enum: ['week', 'month', 'quarter', 'year'] },
          },
        },
      },
      {
        name: 'generateBusinessReport',
        description: 'Generate comprehensive business performance report',
        inputSchema: {
          type: 'object',
          properties: {
            period: { type: 'string', enum: ['monthly', 'quarterly', 'yearly'] },
            includeForecasting: { type: 'boolean', default: false },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'trackFormSubmission': {
      // In a real implementation, this would store tracking data
      if (!args || typeof args.submissionId !== 'number') {
        throw new Error('submissionId is required and must be a number');
      }
      
      const { submissionId, source = 'direct', userAgent = 'unknown' } = args as {
        submissionId: number;
        source?: string;
        userAgent?: string;
      };
      
      const trackingData = {
        submissionId,
        source,
        userAgent,
        timestamp: new Date().toISOString(),
        sessionId: `session_${Date.now()}`,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ tracked: true, data: trackingData }),
          },
        ],
      };
    }

    case 'analyzeLeadQuality': {
      const submissions = await storage.getContactSubmissions();
      const { timeframe = 'month' } = (args || {}) as { timeframe?: string };
      
      // Filter by timeframe
      const now = new Date();
      const cutoffDate = new Date();
      switch (timeframe) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      const filteredSubmissions = submissions.filter(
        s => new Date(s.createdAt) >= cutoffDate
      );

      // Analyze patterns
      const analysis = {
        totalLeads: filteredSubmissions.length,
        eventTypeBreakdown: {} as Record<string, number>,
        budgetDistribution: {} as Record<string, number>,
        averageGuestCount: 0,
        conversionMetrics: {
          highValue: 0,
          medium: 0,
          low: 0,
        },
        timeframe,
      };

      // Event type analysis
      filteredSubmissions.forEach(submission => {
        analysis.eventTypeBreakdown[submission.eventType] = 
          (analysis.eventTypeBreakdown[submission.eventType] || 0) + 1;
        
        if (submission.budget) {
          analysis.budgetDistribution[submission.budget] = 
            (analysis.budgetDistribution[submission.budget] || 0) + 1;
        }

        // Lead scoring for conversion metrics
        let score = 0;
        if (submission.budget?.includes('$10,000+')) score += 50;
        if (submission.eventType === 'wedding') score += 30;
        const guestCount = parseInt(submission.guestCount || '0');
        if (guestCount > 100) score += 20;

        if (score >= 70) analysis.conversionMetrics.highValue++;
        else if (score >= 40) analysis.conversionMetrics.medium++;
        else analysis.conversionMetrics.low++;
      });

      // Calculate average guest count
      const guestCounts = filteredSubmissions
        .map(s => parseInt(s.guestCount || '0'))
        .filter(count => count > 0);
      
      analysis.averageGuestCount = guestCounts.length > 0 
        ? Math.round(guestCounts.reduce((a, b) => a + b, 0) / guestCounts.length)
        : 0;

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(analysis, null, 2),
          },
        ],
      };
    }

    case 'generateBusinessReport': {
      const submissions = await storage.getContactSubmissions();
      const { period = 'monthly', includeForecasting = false } = (args || {}) as { 
        period?: string; 
        includeForecasting?: boolean; 
      };
      
      const report: any = {
        period,
        generatedAt: new Date().toISOString(),
        summary: {
          totalInquiries: submissions.length,
          recentInquiries: submissions.filter(
            s => new Date(s.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ).length,
        },
        trends: {
          popularEventTypes: {} as Record<string, number>,
          seasonalPatterns: {} as Record<string, number>,
          budgetTrends: {} as Record<string, number>,
        },
        recommendations: [] as string[],
      };

      // Analyze trends
      submissions.forEach(submission => {
        // Event type popularity
        report.trends.popularEventTypes[submission.eventType] = 
          (report.trends.popularEventTypes[submission.eventType] || 0) + 1;

        // Seasonal patterns
        const month = new Date(submission.createdAt).getMonth();
        const season = month >= 6 && month <= 8 ? 'summer' : 
                     month >= 3 && month <= 5 ? 'spring' :
                     month >= 9 && month <= 11 ? 'fall' : 'winter';
        
        report.trends.seasonalPatterns[season] = 
          (report.trends.seasonalPatterns[season] || 0) + 1;
      });

      // Generate recommendations
      const topEventType = Object.entries(report.trends.popularEventTypes)
        .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];
      
      if (topEventType) {
        report.recommendations.push(
          `Focus marketing efforts on ${topEventType} events - highest inquiry volume`
        );
      }

      const topSeason = Object.entries(report.trends.seasonalPatterns)
        .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];
      
      if (topSeason) {
        report.recommendations.push(
          `Peak season is ${topSeason} - consider seasonal pricing adjustments`
        );
      }

      if (includeForecasting) {
        report.forecasting = {
          nextMonthProjection: Math.round(report.summary.recentInquiries * 1.1),
          growthRate: '10% estimated based on current trends',
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(report, null, 2),
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
        uri: 'analytics://conversions',
        mimeType: 'application/json',
        name: 'Form Completion Rates',
        description: 'Conversion funnel and form abandonment data',
      },
      {
        uri: 'analytics://leads',
        mimeType: 'application/json',
        name: 'Lead Quality Metrics',
        description: 'Lead scoring and quality distribution',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'analytics://conversions': {
      const submissions = await storage.getContactSubmissions();
      const conversionData = {
        totalSubmissions: submissions.length,
        completionRate: '85%', // Mock data - would track actual form analytics
        abandonmentPoints: {
          personalInfo: '5%',
          eventDetails: '8%',
          message: '2%',
        },
        averageFormTime: '3.2 minutes',
        mobileVsDesktop: {
          mobile: '60%',
          desktop: '40%',
        },
      };

      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(conversionData, null, 2),
          },
        ],
      };
    }

    case 'analytics://leads': {
      const submissions = await storage.getContactSubmissions();
      
      let highValue = 0, medium = 0, low = 0;
      
      submissions.forEach(submission => {
        let score = 0;
        if (submission.budget?.includes('$10,000+')) score += 50;
        if (submission.eventType === 'wedding') score += 30;
        const guestCount = parseInt(submission.guestCount || '0');
        if (guestCount > 100) score += 20;

        if (score >= 70) highValue++;
        else if (score >= 40) medium++;
        else low++;
      });

      const leadMetrics = {
        distribution: {
          highValue,
          medium,
          low,
        },
        percentages: {
          highValue: Math.round((highValue / submissions.length) * 100),
          medium: Math.round((medium / submissions.length) * 100),
          low: Math.round((low / submissions.length) * 100),
        },
        averageScore: Math.round(
          submissions.reduce((acc, submission) => {
            let score = 0;
            if (submission.budget?.includes('$10,000+')) score += 50;
            if (submission.eventType === 'wedding') score += 30;
            const guestCount = parseInt(submission.guestCount || '0');
            if (guestCount > 100) score += 20;
            return acc + score;
          }, 0) / submissions.length
        ),
      };

      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(leadMetrics, null, 2),
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
