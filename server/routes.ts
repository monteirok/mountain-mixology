import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { mcpWorkflow } from "./mcp-workflow";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission with MCP workflow integration
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(data);
      
      console.log(`New contact submission received: ${submission.firstName} ${submission.lastName} (ID: ${submission.id})`);
      
      // Execute MCP workflow asynchronously (don't block response)
      mcpWorkflow.executeContactWorkflow(submission).then(
        (workflowResult) => {
          console.log(`MCP workflow completed for submission ${submission.id}:`, {
            success: workflowResult.success,
            errors: workflowResult.errors.length,
          });
          
          if (workflowResult.errors.length > 0) {
            console.warn(`MCP workflow errors for submission ${submission.id}:`, workflowResult.errors);
          }
        }
      ).catch((error) => {
        console.error(`MCP workflow failed for submission ${submission.id}:`, error);
      });
      
      res.json({ 
        success: true, 
        id: submission.id,
        message: "Thank you for your inquiry! We'll be in touch within 24 hours."
      });
    } catch (error) {
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
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Trigger MCP workflow manually for a submission (admin use)
  app.post("/api/contact/:id/workflow", async (req, res) => {
    try {
      const submissionId = parseInt(req.params.id);
      const submissions = await storage.getContactSubmissions();
      const submission = submissions.find(s => s.id === submissionId);
      
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }

      console.log(`Manual MCP workflow trigger for submission ${submissionId}`);
      
      const workflowResult = await mcpWorkflow.executeContactWorkflow(submission);
      
      res.json({
        success: true,
        submissionId,
        workflow: workflowResult,
      });
    } catch (error) {
      console.error("Manual workflow execution failed:", error);
      res.status(500).json({ error: "Workflow execution failed" });
    }
  });

  // Get MCP workflow status for debugging
  app.get("/api/mcp/status", async (req, res) => {
    try {
      res.json({
        status: "active",
        servers: {
          contact: { enabled: true, description: "Contact form handling and lead scoring" },
          email: { enabled: true, description: "Automated email sequences and notifications" },
          crm: { enabled: true, description: "HubSpot CRM integration and lead management" },
          calendar: { enabled: true, description: "Google Calendar integration and availability" },
          payment: { enabled: true, description: "Stripe payment processing and invoicing" },
        },
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
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
