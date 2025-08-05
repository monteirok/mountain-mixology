import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission (simplified - without MCP workflow for now)
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(data);
      
      console.log(`New contact submission received: ${submission.firstName} ${submission.lastName} (ID: ${submission.id})`);
      
      // TODO: Add MCP workflow integration here once imports are fixed
      
      res.json({ 
        success: true, 
        id: submission.id,
        message: "Thank you for your inquiry! We'll be in touch within 24 hours."
      });
    } catch (error) {
      console.error("Contact submission error:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get contact submissions (for admin purposes)
  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Get submissions error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Trigger MCP workflow for a specific contact submission
  app.post("/api/contact/:id/workflow", async (req, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      
      if (isNaN(submissionId)) {
        return res.status(400).json({ error: "Invalid submission ID" });
      }

      // Simulate workflow execution (since MCP servers are disabled)
      const workflowResult = {
        success: true,
        submissionId: submissionId,
        workflow: {
          success: true,
          results: {
            email: { welcomeEmailSent: false, messageId: null },
            crm: { contactSynced: false, hubspotContactId: null, leadScore: null },
            calendar: { availabilityChecked: false, conflicts: [] },
            communication: { slackNotificationSent: false }
          },
          errors: ["MCP servers are currently disabled for basic functionality"]
        }
      };

      console.log(`Workflow triggered for submission ${submissionId} (simulated)`);
      
      res.json(workflowResult);
    } catch (error) {
      console.error("Workflow trigger error:", error);
      res.status(500).json({ error: "Failed to trigger workflow" });
    }
  });

  // Get MCP workflow status for debugging
  app.get("/api/mcp/status", async (req, res) => {
    try {
      res.json({
        status: "active",
        servers: {
          contact: { enabled: true, description: "Contact form handling and lead scoring" },
          email: { enabled: false, description: "Automated email sequences and notifications" },
          crm: { enabled: false, description: "HubSpot CRM integration and lead management" },
          calendar: { enabled: false, description: "Google Calendar integration and availability" },
          payment: { enabled: false, description: "Stripe payment processing and invoicing" },
        },
        lastUpdated: new Date().toISOString(),
        note: "MCP servers temporarily disabled for basic functionality",
      });
    } catch (error) {
      console.error("MCP status error:", error);
      res.status(500).json({ error: "Failed to get MCP status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function validateRequest(schema: any) {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: "Validation failed" });
    }
  };
}