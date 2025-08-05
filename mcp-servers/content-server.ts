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
    name: 'mountain-mixology-content',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Mock content data
const cocktailMenu = [
  {
    id: 1,
    name: 'Mountain Mule',
    description: 'Premium vodka, fresh ginger, lime, mountain spring water',
    category: 'signature',
    seasonal: false,
    ingredients: ['vodka', 'ginger beer', 'lime', 'mint'],
    price: 14,
  },
  {
    id: 2,
    name: 'Alpine Old Fashioned',
    description: 'Bourbon, maple syrup, orange bitters, smoked salt rim',
    category: 'classic',
    seasonal: true,
    season: 'fall',
    ingredients: ['bourbon', 'maple syrup', 'orange bitters'],
    price: 16,
  },
];

const galleryImages = [
  {
    id: 1,
    url: '/images/gallery/wedding-setup.jpg',
    title: 'Elegant Wedding Bar Setup',
    eventType: 'wedding',
    featured: true,
    tags: ['outdoor', 'elegant', 'mountain-view'],
  },
  {
    id: 2,
    url: '/images/gallery/corporate-event.jpg',
    title: 'Corporate Event Service',
    eventType: 'corporate',
    featured: false,
    tags: ['indoor', 'professional', 'networking'],
  },
];

const testimonials = [
  {
    id: 1,
    clientName: 'Sarah & Mike',
    eventType: 'wedding',
    rating: 5,
    text: 'Mountain Mixology made our wedding absolutely perfect!',
    approved: true,
    featured: true,
    date: '2024-01-15',
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'updateCocktailMenu',
        description: 'Add or update cocktail menu items',
        inputSchema: {
          type: 'object',
          properties: {
            cocktail: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                category: { type: 'string', enum: ['signature', 'classic', 'seasonal'] },
                ingredients: { type: 'array', items: { type: 'string' } },
                price: { type: 'number' },
                seasonal: { type: 'boolean' },
                season: { type: 'string', enum: ['spring', 'summer', 'fall', 'winter'] },
              },
              required: ['name', 'description', 'category', 'ingredients', 'price'],
            },
            action: { type: 'string', enum: ['add', 'update', 'remove'] },
            id: { type: 'number' },
          },
          required: ['cocktail', 'action'],
        },
      },
      {
        name: 'addGalleryImage',
        description: 'Add new images to event gallery',
        inputSchema: {
          type: 'object',
          properties: {
            image: {
              type: 'object',
              properties: {
                url: { type: 'string' },
                title: { type: 'string' },
                eventType: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } },
                featured: { type: 'boolean', default: false },
              },
              required: ['url', 'title', 'eventType'],
            },
          },
          required: ['image'],
        },
      },
      {
        name: 'moderateReviews',
        description: 'Approve or reject customer testimonials',
        inputSchema: {
          type: 'object',
          properties: {
            reviewId: { type: 'number' },
            action: { type: 'string', enum: ['approve', 'reject', 'feature', 'unfeature'] },
            moderatorNotes: { type: 'string' },
          },
          required: ['reviewId', 'action'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'updateCocktailMenu': {
      const { cocktail, action, id } = args;

      switch (action) {
        case 'add': {
          const newCocktail = {
            id: cocktailMenu.length + 1,
            ...cocktail,
          };
          cocktailMenu.push(newCocktail);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  action: 'added',
                  cocktail: newCocktail,
                  totalItems: cocktailMenu.length,
                }),
              },
            ],
          };
        }

        case 'update': {
          const index = cocktailMenu.findIndex(c => c.id === id);
          if (index === -1) {
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({ error: 'Cocktail not found' }),
                },
              ],
            };
          }

          cocktailMenu[index] = { ...cocktailMenu[index], ...cocktail };

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  action: 'updated',
                  cocktail: cocktailMenu[index],
                }),
              },
            ],
          };
        }

        case 'remove': {
          const index = cocktailMenu.findIndex(c => c.id === id);
          if (index === -1) {
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({ error: 'Cocktail not found' }),
                },
              ],
            };
          }

          const removed = cocktailMenu.splice(index, 1)[0];

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  action: 'removed',
                  cocktail: removed,
                  totalItems: cocktailMenu.length,
                }),
              },
            ],
          };
        }
      }
      break;
    }

    case 'addGalleryImage': {
      const { image } = args;
      
      const newImage = {
        id: galleryImages.length + 1,
        ...image,
        uploadedAt: new Date().toISOString(),
      };

      galleryImages.push(newImage);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              image: newImage,
              totalImages: galleryImages.length,
            }),
          },
        ],
      };
    }

    case 'moderateReviews': {
      const { reviewId, action, moderatorNotes } = args;
      
      const review = testimonials.find(t => t.id === reviewId);
      if (!review) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: 'Review not found' }),
            },
          ],
        };
      }

      switch (action) {
        case 'approve':
          review.approved = true;
          break;
        case 'reject':
          review.approved = false;
          break;
        case 'feature':
          review.featured = true;
          review.approved = true;
          break;
        case 'unfeature':
          review.featured = false;
          break;
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              action,
              review,
              moderatorNotes,
            }),
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
        uri: 'content://cocktails',
        mimeType: 'application/json',
        name: 'Cocktail Menu Items',
        description: 'Complete cocktail menu with seasonal items',
      },
      {
        uri: 'content://gallery',
        mimeType: 'application/json',
        name: 'Event Photo Gallery',
        description: 'Curated gallery of past events and setups',
      },
      {
        uri: 'content://reviews',
        mimeType: 'application/json',
        name: 'Customer Testimonials',
        description: 'Approved customer reviews and testimonials',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'content://cocktails': {
      const currentSeason = getCurrentSeason();
      const menuData = {
        items: cocktailMenu,
        categories: {
          signature: cocktailMenu.filter(c => c.category === 'signature'),
          classic: cocktailMenu.filter(c => c.category === 'classic'),
          seasonal: cocktailMenu.filter(c => c.seasonal && c.season === currentSeason),
        },
        totalItems: cocktailMenu.length,
        currentSeason,
      };

      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(menuData, null, 2),
          },
        ],
      };
    }

    case 'content://gallery': {
      const galleryData = {
        images: galleryImages,
        featured: galleryImages.filter(img => img.featured),
        byEventType: {
          wedding: galleryImages.filter(img => img.eventType === 'wedding'),
          corporate: galleryImages.filter(img => img.eventType === 'corporate'),
          private: galleryImages.filter(img => img.eventType === 'private'),
        },
        totalImages: galleryImages.length,
      };

      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(galleryData, null, 2),
          },
        ],
      };
    }

    case 'content://reviews': {
      const reviewData = {
        testimonials: testimonials.filter(t => t.approved),
        featured: testimonials.filter(t => t.featured && t.approved),
        pending: testimonials.filter(t => !t.approved),
        averageRating: testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length,
        totalReviews: testimonials.length,
      };

      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(reviewData, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
