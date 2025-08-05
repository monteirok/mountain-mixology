import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Simple in-memory storage for demo purposes
let contactId = 1;
const contacts: any[] = [];

// Contact form validation schema
const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  eventType: z.string().min(1, "Please select an event type"),
  guestCount: z.string().optional(),
  eventDate: z.string().optional(),
  budget: z.string().optional(),
  location: z.string().optional(),
  message: z.string().min(10, "Please provide more details about your event"),
  newsletter: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the contact form data
    const validatedData = contactSchema.parse(body);
    
    // Create contact submission
    const submission = {
      id: contactId++,
      ...validatedData,
      createdAt: new Date().toISOString(),
    };
    
    // Store in memory (in production, this would go to a database)
    contacts.push(submission);
    
    console.log(`New contact submission received: ${submission.firstName} ${submission.lastName} (ID: ${submission.id})`);
    
    // In a full implementation, this would trigger:
    // - Welcome email automation
    // - Lead scoring and CRM sync
    // - Calendar availability check
    // - Team notifications
    console.log('MCP Workflow would be triggered here (demo mode)');
    
    return NextResponse.json({
      success: true,
      id: submission.id,
      message: "Thank you for your inquiry! We'll be in touch within 24 hours."
    });
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return stored contacts for admin dashboard
    return NextResponse.json(contacts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}