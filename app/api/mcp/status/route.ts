import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return MCP server status (demo mode)
    return NextResponse.json({
      status: "demo",
      servers: {
        contact: { enabled: true, description: "Contact form handling and lead scoring" },
        email: { enabled: false, description: "Automated email sequences (demo mode)" },
        crm: { enabled: false, description: "HubSpot CRM integration (demo mode)" },
        calendar: { enabled: false, description: "Google Calendar integration (demo mode)" },
        payment: { enabled: false, description: "Stripe payment processing (demo mode)" },
      },
      lastUpdated: new Date().toISOString(),
      note: "Running in demo mode - configure API keys for full functionality",
    });
    
  } catch (error) {
    console.error('MCP status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}