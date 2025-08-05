import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import Stripe from 'stripe';
import { externalServiceConfig } from './mcp-config.js';
import { storage } from '../server/storage.js';

const server = new Server(
  {
    name: 'mountain-mixology-payment',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

const stripe = externalServiceConfig.stripe.enabled 
  ? new Stripe(externalServiceConfig.stripe.secretKey, {
      apiVersion: '2025-07-30.basil',
    })
  : null;

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret?: string;
}

interface Invoice {
  id: string;
  customerId: string;
  amount: number;
  dueDate?: string;
  status: string;
  description?: string;
}

interface PricingTier {
  name: string;
  basePrice: number;
  description: string;
  inclusions: string[];
  minimumGuests: number;
  maximumGuests: number;
}

const pricingTiers: Record<string, PricingTier> = {
  'essential': {
    name: 'Essential Package',
    basePrice: 1500,
    description: 'Perfect for intimate gatherings and smaller events',
    inclusions: [
      'Professional bartender for 4 hours',
      'Basic bar setup and breakdown',
      'Standard glassware and bar tools',
      '3 signature cocktails',
      'Non-alcoholic beverages',
    ],
    minimumGuests: 10,
    maximumGuests: 30,
  },
  'premium': {
    name: 'Premium Package',
    basePrice: 2500,
    description: 'Elevated experience for medium-sized celebrations',
    inclusions: [
      'Professional bartender for 6 hours',
      'Premium bar setup with custom signage',
      'Premium glassware and bar tools',
      '5 signature cocktails',
      'Wine and beer service',
      'Appetizer pairings',
      'Custom cocktail menu design',
    ],
    minimumGuests: 25,
    maximumGuests: 75,
  },
  'luxury': {
    name: 'Luxury Package',
    basePrice: 4000,
    description: 'The ultimate cocktail experience for grand celebrations',
    inclusions: [
      '2 professional bartenders for 8 hours',
      'Luxury bar setup with custom branding',
      'Crystal glassware and professional tools',
      'Unlimited signature cocktails',
      'Full wine and beer service',
      'Gourmet appetizer stations',
      'Custom cocktail menu and signage',
      'Event coordination and planning',
      'Premium ingredients and garnishes',
    ],
    minimumGuests: 50,
    maximumGuests: 150,
  },
};

function calculateEventPricing(guestCount: number, eventType: string, packageTier: string): number {
  const tier = pricingTiers[packageTier] || pricingTiers['premium'];
  let totalPrice = tier.basePrice;

  const perGuestRate = packageTier === 'luxury' ? 35 : packageTier === 'premium' ? 25 : 15;
  const guestsAboveMinimum = Math.max(0, guestCount - tier.minimumGuests);
  totalPrice += guestsAboveMinimum * perGuestRate;

  const eventMultipliers = {
    'wedding': 1.2,
    'corporate': 1.1,
    'private': 1.0,
    'birthday': 1.0,
  };

  const multiplier = eventMultipliers[eventType] || 1.0;
  return Math.round(totalPrice * multiplier);
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = [
    {
      name: 'createPaymentIntent',
      description: 'Create a Stripe payment intent for event deposit or full payment',
      inputSchema: {
        type: 'object',
        properties: {
          submissionId: { type: 'number' },
          amount: { type: 'number' },
          currency: { type: 'string', default: 'usd' },
          paymentType: { 
            type: 'string',
            enum: ['deposit', 'full_payment', 'final_payment'],
            default: 'deposit'
          },
          description: { type: 'string' },
        },
        required: ['submissionId', 'amount'],
      },
    },
    {
      name: 'generateQuote',
      description: 'Generate pricing quote based on event details',
      inputSchema: {
        type: 'object',
        properties: {
          submissionId: { type: 'number' },
          packageTier: { 
            type: 'string',
            enum: ['essential', 'premium', 'luxury'],
            default: 'premium'
          },
          customAddOns: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                price: { type: 'number' },
                description: { type: 'string' },
              },
            },
          },
        },
        required: ['submissionId'],
      },
    },
    {
      name: 'createInvoice',
      description: 'Create and send invoice for event services',
      inputSchema: {
        type: 'object',
        properties: {
          submissionId: { type: 'number' },
          amount: { type: 'number' },
          dueDate: { type: 'string', format: 'date' },
          description: { type: 'string' },
          lineItems: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                description: { type: 'string' },
                quantity: { type: 'number' },
                unitPrice: { type: 'number' },
              },
            },
          },
        },
        required: ['submissionId', 'amount'],
      },
    },
    {
      name: 'processRefund',
      description: 'Process refund for cancelled or modified bookings',
      inputSchema: {
        type: 'object',
        properties: {
          paymentIntentId: { type: 'string' },
          amount: { type: 'number' },
          reason: { type: 'string' },
        },
        required: ['paymentIntentId'],
      },
    },
    {
      name: 'getPaymentStatus',
      description: 'Check status of payment or invoice',
      inputSchema: {
        type: 'object',
        properties: {
          paymentId: { type: 'string' },
          invoiceId: { type: 'string' },
        },
      },
    },
    {
      name: 'setupRecurringPayment',
      description: 'Set up recurring payment for ongoing services',
      inputSchema: {
        type: 'object',
        properties: {
          customerId: { type: 'string' },
          amount: { type: 'number' },
          interval: { 
            type: 'string',
            enum: ['month', 'year'],
            default: 'month'
          },
          description: { type: 'string' },
        },
        required: ['customerId', 'amount'],
      },
    },
    {
      name: 'getRevenueAnalytics',
      description: 'Get revenue analytics and payment metrics',
      inputSchema: {
        type: 'object',
        properties: {
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          groupBy: { 
            type: 'string',
            enum: ['day', 'week', 'month'],
            default: 'month'
          },
        },
      },
    },
  ];

  return { tools: stripe ? tools : [] };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (!stripe) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: 'Stripe payment processing not configured' }),
        },
      ],
    };
  }

  const { name, arguments: args } = request.params as { name: string; arguments: any };

  try {
    switch (name) {
      case 'createPaymentIntent': {
        const { submissionId, amount, currency = 'usd', paymentType = 'deposit', description } = args;
        const submissions = await storage.getContactSubmissions();
        const submission = submissions.find(s => s.id === submissionId);
        
        if (!submission) {
          throw new Error('Submission not found');
        }

        let customer;
        try {
          const customers = await stripe.customers.list({
            email: submission.email,
            limit: 1,
          });
          
          if (customers.data.length > 0) {
            customer = customers.data[0];
          } else {
            customer = await stripe.customers.create({
              email: submission.email,
              name: `${submission.firstName} ${submission.lastName}`,
              phone: submission.phone,
              metadata: {
                submissionId: submissionId.toString(),
                eventType: submission.eventType || 'event',
              },
            });
          }
        } catch (error) {
          console.warn('Customer creation error:', error);
        }

        const paymentIntentDescription = description || 
          `${paymentType === 'deposit' ? 'Deposit' : 'Payment'} for ${submission.eventType || 'event'} - ${submission.firstName} ${submission.lastName}`;

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency,
          customer: customer?.id,
          description: paymentIntentDescription,
          metadata: {
            submissionId: submissionId.toString(),
            paymentType,
            eventType: submission.eventType || 'event',
            eventDate: submission.eventDate || 'TBD',
          },
          automatic_payment_methods: {
            enabled: true,
          },
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
                amount: amount,
                currency,
                status: paymentIntent.status,
                customerId: customer?.id,
              }),
            },
          ],
        };
      }

      case 'generateQuote': {
        const { submissionId, packageTier = 'premium', customAddOns = [] } = args;
        const submissions = await storage.getContactSubmissions();
        const submission = submissions.find(s => s.id === submissionId);
        
        if (!submission) {
          throw new Error('Submission not found');
        }

        const guestCount = parseInt(submission.guestCount || '50');
        const eventType = submission.eventType || 'private';
        
        const basePrice = calculateEventPricing(guestCount, eventType, packageTier);
        const addOnTotal = customAddOns.reduce((sum, addOn) => sum + (addOn.price || 0), 0);
        const subtotal = basePrice + addOnTotal;
        
        const taxRate = 0.08;
        const tax = Math.round(subtotal * taxRate);
        const total = subtotal + tax;

        const tier = pricingTiers[packageTier];
        
        const quote = {
          submissionId,
          client: {
            name: `${submission.firstName} ${submission.lastName}`,
            email: submission.email,
            phone: submission.phone,
          },
          event: {
            type: eventType,
            date: submission.eventDate,
            location: submission.location,
            guestCount,
          },
          pricing: {
            package: {
              name: tier.name,
              basePrice,
              description: tier.description,
              inclusions: tier.inclusions,
            },
            addOns: customAddOns,
            subtotal,
            tax,
            total,
            deposit: Math.round(total * 0.3),
            finalPayment: Math.round(total * 0.7),
          },
          terms: {
            depositDue: '7 days to secure booking',
            finalPaymentDue: '7 days before event',
            cancellationPolicy: 'Full refund if cancelled 30+ days before event',
            validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          },
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

      case 'createInvoice': {
        const { submissionId, amount, dueDate, description, lineItems = [] } = args;
        const submissions = await storage.getContactSubmissions();
        const submission = submissions.find(s => s.id === submissionId);
        
        if (!submission) {
          throw new Error('Submission not found');
        }

        let customer;
        try {
          const customers = await stripe.customers.list({
            email: submission.email,
            limit: 1,
          });
          
          if (customers.data.length > 0) {
            customer = customers.data[0];
          } else {
            customer = await stripe.customers.create({
              email: submission.email,
              name: `${submission.firstName} ${submission.lastName}`,
              phone: submission.phone,
              metadata: {
                submissionId: submissionId.toString(),
              },
            });
          }
        } catch (error) {
          throw new Error('Failed to create or find customer');
        }

        const invoice = await stripe.invoices.create({
          customer: customer.id,
          description: description || `Invoice for ${submission.eventType || 'event'} services`,
          due_date: dueDate ? Math.floor(new Date(dueDate).getTime() / 1000) : undefined,
          collection_method: 'send_invoice',
          days_until_due: dueDate ? undefined : 30,
          metadata: {
            submissionId: submissionId.toString(),
            eventType: submission.eventType || 'event',
          },
        });

        if (lineItems.length > 0) {
          for (const item of lineItems) {
            await stripe.invoiceItems.create({
              customer: customer.id,
              invoice: invoice.id,
              description: item.description,
              quantity: item.quantity || 1,
              amount: Math.round((item.unitPrice || 0) * 100),
            });
          }
        } else {
          await stripe.invoiceItems.create({
            customer: customer.id,
            invoice: invoice.id,
            description: description || 'Event Services',
            amount: Math.round(amount * 100),
          });
        }

        const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
        await stripe.invoices.sendInvoice(finalizedInvoice.id);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                invoiceId: finalizedInvoice.id,
                invoiceUrl: finalizedInvoice.hosted_invoice_url,
                amount,
                status: finalizedInvoice.status,
                dueDate: finalizedInvoice.due_date,
                customerId: customer.id,
              }),
            },
          ],
        };
      }

      case 'processRefund': {
        const { paymentIntentId, amount, reason } = args;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status !== 'succeeded') {
          throw new Error('Payment not eligible for refund');
        }

        const refundAmount = amount ? Math.round(amount * 100) : undefined;
        
        const refund = await stripe.refunds.create({
          payment_intent: paymentIntentId,
          amount: refundAmount,
          reason: reason === 'fraud' ? 'fraudulent' : 'requested_by_customer',
          metadata: {
            refund_reason: reason || 'Customer request',
          },
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                refundId: refund.id,
                amount: refund.amount / 100,
                status: refund.status,
                reason: reason,
                originalPaymentId: paymentIntentId,
              }),
            },
          ],
        };
      }

      case 'getPaymentStatus': {
        const { paymentId, invoiceId } = args;

        if (paymentId) {
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  type: 'payment',
                  id: paymentIntent.id,
                  status: paymentIntent.status,
                  amount: paymentIntent.amount / 100,
                  currency: paymentIntent.currency,
                  created: new Date(paymentIntent.created * 1000).toISOString(),
                  metadata: paymentIntent.metadata,
                }),
              },
            ],
          };
        }

        if (invoiceId) {
          const invoice = await stripe.invoices.retrieve(invoiceId);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  type: 'invoice',
                  id: invoice.id,
                  status: invoice.status,
                  amount: invoice.amount_due / 100,
                  currency: invoice.currency,
                  dueDate: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
                  paid: invoice.status === 'paid',
                  invoiceUrl: invoice.hosted_invoice_url,
                }),
              },
            ],
          };
        }

        throw new Error('Either paymentId or invoiceId must be provided');
      }

      case 'setupRecurringPayment': {
        const { customerId, amount, interval = 'month', description } = args;

        const price = await stripe.prices.create({
          unit_amount: Math.round(amount * 100),
          currency: 'usd',
          recurring: {
            interval,
          },
          product_data: {
            name: description || 'Mountain Mixology Recurring Service',
          },
        });

        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: price.id }],
          metadata: {
            service_type: 'recurring_event_service',
          },
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                subscriptionId: subscription.id,
                priceId: price.id,
                status: subscription.status,
                amount,
                interval,
                currentPeriodEnd: new Date((subscription as any).current_period_end * 1000).toISOString(),
              }),
            },
          ],
        };
      }

      case 'getRevenueAnalytics': {
        const { startDate, endDate, groupBy = 'month' } = args;
        
        const start = startDate ? Math.floor(new Date(startDate).getTime() / 1000) : Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000);
        const end = endDate ? Math.floor(new Date(endDate).getTime() / 1000) : Math.floor(Date.now() / 1000);

        const paymentIntents = await stripe.paymentIntents.list({
          created: { gte: start, lte: end },
          limit: 100,
        });

        const invoices = await stripe.invoices.list({
          created: { gte: start, lte: end },
          status: 'paid',
          limit: 100,
        });

        const totalRevenue = paymentIntents.data.reduce((sum, pi) => {
          return pi.status === 'succeeded' ? sum + pi.amount : sum;
        }, 0) / 100;

        const invoiceRevenue = invoices.data.reduce((sum, inv) => sum + inv.amount_due, 0) / 100;

        const analytics = {
          dateRange: {
            start: new Date(start * 1000).toISOString().split('T')[0],
            end: new Date(end * 1000).toISOString().split('T')[0],
          },
          revenue: {
            total: totalRevenue + invoiceRevenue,
            payments: totalRevenue,
            invoices: invoiceRevenue,
          },
          transactions: {
            totalPayments: paymentIntents.data.filter(pi => pi.status === 'succeeded').length,
            totalInvoices: invoices.data.length,
            averagePaymentAmount: paymentIntents.data.length > 0 ? totalRevenue / paymentIntents.data.filter(pi => pi.status === 'succeeded').length : 0,
          },
          topEventTypes: {} as Record<string, { count: number; revenue: number }>,
        };

        paymentIntents.data.forEach(pi => {
          const eventType = pi.metadata.eventType || 'unknown';
          if (!analytics.topEventTypes[eventType]) {
            analytics.topEventTypes[eventType] = { count: 0, revenue: 0 };
          }
          if (pi.status === 'succeeded') {
            analytics.topEventTypes[eventType].count += 1;
            analytics.topEventTypes[eventType].revenue += pi.amount / 100;
          }
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(analytics, null, 2),
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
    resources: stripe ? [
      {
        uri: 'payment://pricing-tiers',
        mimeType: 'application/json',
        name: 'Pricing Tiers',
        description: 'Available service packages and pricing structures',
      },
      {
        uri: 'payment://transactions',
        mimeType: 'application/json',
        name: 'Recent Transactions',
        description: 'Recent payment transactions and invoices',
      },
      {
        uri: 'payment://revenue-summary',
        mimeType: 'application/json',
        name: 'Revenue Summary',
        description: 'Revenue analytics and business metrics',
      },
      {
        uri: 'payment://customers',
        mimeType: 'application/json',
        name: 'Customer Payment Data',
        description: 'Customer payment history and preferences',
      },
    ] : [],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (!stripe) {
    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: 'application/json',
          text: JSON.stringify({ error: 'Stripe payment processing not configured' }),
        },
      ],
    };
  }

  const { uri } = request.params;

  try {
    switch (uri) {
      case 'payment://pricing-tiers': {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(pricingTiers, null, 2),
            },
          ],
        };
      }

      case 'payment://transactions': {
        const recentPayments = await stripe.paymentIntents.list({
          limit: 20,
        });

        const recentInvoices = await stripe.invoices.list({
          limit: 10,
        });

        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({
                payments: recentPayments.data.map(pi => ({
                  id: pi.id,
                  amount: pi.amount / 100,
                  currency: pi.currency,
                  status: pi.status,
                  created: new Date(pi.created * 1000).toISOString(),
                  metadata: pi.metadata,
                })),
                invoices: recentInvoices.data.map(inv => ({
                  id: inv.id,
                  amount: inv.amount_due / 100,
                  status: inv.status,
                  dueDate: inv.due_date ? new Date(inv.due_date * 1000).toISOString() : null,
                  paid: inv.status === 'paid',
                })),
              }, null, 2),
            },
          ],
        };
      }

      case 'payment://revenue-summary': {
        const thirtyDaysAgo = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);
        const now = Math.floor(Date.now() / 1000);

        const recentPayments = await stripe.paymentIntents.list({
          created: { gte: thirtyDaysAgo, lte: now },
          limit: 100,
        });

        const totalRevenue = recentPayments.data.reduce((sum, pi) => {
          return pi.status === 'succeeded' ? sum + pi.amount : sum;
        }, 0) / 100;

        const summary = {
          period: '30 days',
          totalRevenue,
          successfulPayments: recentPayments.data.filter(pi => pi.status === 'succeeded').length,
          averageTransactionValue: recentPayments.data.length > 0 ? totalRevenue / recentPayments.data.filter(pi => pi.status === 'succeeded').length : 0,
          paymentMethods: {} as Record<string, number>,
          eventTypes: {} as Record<string, { count: number; revenue: number }>,
        };

        recentPayments.data.forEach(pi => {
          const eventType = pi.metadata.eventType || 'unknown';
          if (!summary.eventTypes[eventType]) {
            summary.eventTypes[eventType] = { count: 0, revenue: 0 };
          }
          if (pi.status === 'succeeded') {
            summary.eventTypes[eventType].count += 1;
            summary.eventTypes[eventType].revenue += pi.amount / 100;
          }
        });

        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(summary, null, 2),
            },
          ],
        };
      }

      case 'payment://customers': {
        const customers = await stripe.customers.list({
          limit: 50,
        });

        const customerData = customers.data.map(customer => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          created: new Date(customer.created * 1000).toISOString(),
          metadata: customer.metadata,
        }));

        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(customerData, null, 2),
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