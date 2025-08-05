import { externalServiceConfig } from '../mcp-servers/mcp-config.js';

interface ContactSubmission {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  eventType: string;
  guestCount: string | null;
  eventDate: string | null;
  budget: string | null;
  location: string | null;
  message: string;
  newsletter: string | null;
  createdAt: Date;
}

interface MCPWorkflowResult {
  success: boolean;
  results: {
    email?: {
      welcomeEmailSent: boolean;
      messageId?: string;
    };
    crm?: {
      contactSynced: boolean;
      hubspotContactId?: string;
      leadScore?: number;
      dealCreated?: boolean;
    };
    calendar?: {
      availabilityChecked: boolean;
      conflicts?: any[];
      seasonalPricing?: any;
    };
    communication?: {
      slackNotificationSent: boolean;
    };
  };
  errors: string[];
}

export class MCPWorkflowOrchestrator {
  private async callMCPTool(serverName: string, toolName: string, args: any): Promise<any> {
    try {
      const response = await fetch(`http://localhost:3002/mcp/${serverName}/${toolName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args),
      });
      
      if (!response.ok) {
        throw new Error(`MCP ${serverName} call failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn(`MCP ${serverName}.${toolName} call failed:`, error);
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }

  async executeContactWorkflow(submission: ContactSubmission): Promise<MCPWorkflowResult> {
    const results: MCPWorkflowResult['results'] = {};
    const errors: string[] = [];

    console.log(`Starting MCP workflow for submission ${submission.id}`);

    // 1. Send Welcome Email
    try {
      if (externalServiceConfig.email.gmail.enabled) {
        const emailResult = await this.callMCPTool('email', 'sendWelcomeEmail', {
          submissionId: submission.id,
        });

        if (emailResult.error) {
          errors.push(`Email workflow failed: ${emailResult.error}`);
          results.email = { welcomeEmailSent: false };
        } else {
          results.email = {
            welcomeEmailSent: true,
            messageId: emailResult.messageId,
          };
          console.log(`Welcome email sent to ${submission.email}`);
        }
      }
    } catch (error) {
      errors.push(`Email workflow error: ${error instanceof Error ? error.message : String(error)}`);
      results.email = { welcomeEmailSent: false };
    }

    // 2. Lead Scoring and CRM Sync
    try {
      const leadScoreResult = await this.callMCPTool('contact', 'scoreLeadQuality', {
        submissionId: submission.id,
      });

      let leadScore = 0;
      if (!leadScoreResult.error) {
        leadScore = leadScoreResult.score || 0;
        console.log(`Lead score calculated: ${leadScore}`);
      }

      if (externalServiceConfig.hubspot.enabled) {
        const crmResult = await this.callMCPTool('crm', 'syncContactToHubSpot', {
          submissionId: submission.id,
        });

        if (crmResult.error) {
          errors.push(`CRM sync failed: ${crmResult.error}`);
          results.crm = { contactSynced: false };
        } else {
          results.crm = {
            contactSynced: true,
            hubspotContactId: crmResult.hubspotContactId,
            leadScore,
          };

          if (leadScore >= 70) {
            const dealResult = await this.callMCPTool('crm', 'createHubSpotDeal', {
              submissionId: submission.id,
              dealStage: 'appointmentscheduled',
            });

            if (!dealResult.error) {
              results.crm.dealCreated = true;
              console.log(`High-value deal created for ${submission.firstName} ${submission.lastName}`);
            }
          }

          const followUpResult = await this.callMCPTool('crm', 'setupFollowUpSequence', {
            hubspotContactId: crmResult.hubspotContactId,
            sequenceType: 'initial_inquiry',
          });

          if (!followUpResult.error) {
            console.log(`Follow-up sequence created for ${submission.firstName} ${submission.lastName}`);
          }
        }
      }
    } catch (error) {
      errors.push(`CRM workflow error: ${error instanceof Error ? error.message : String(error)}`);
      results.crm = { contactSynced: false };
    }

    // 3. Calendar Availability Check
    try {
      if (submission.eventDate) {
        const availabilityResult = await this.callMCPTool('calendar', 'checkAvailability', {
          startDate: submission.eventDate,
          eventType: submission.eventType,
        });

        if (availabilityResult.error) {
          errors.push(`Calendar check failed: ${availabilityResult.error}`);
          results.calendar = { availabilityChecked: false };
        } else {
          results.calendar = {
            availabilityChecked: true,
            conflicts: availabilityResult.conflicts || [],
            seasonalPricing: availabilityResult.seasonalPricing,
          };
          console.log(`Availability checked for ${submission.eventDate}: ${availabilityResult.available ? 'Available' : 'Conflicts found'}`);
        }
      }
    } catch (error) {
      errors.push(`Calendar workflow error: ${error instanceof Error ? error.message : String(error)}`);
      results.calendar = { availabilityChecked: false };
    }

    // 4. Team Notification (if Slack is configured)
    try {
      if (externalServiceConfig.slack.enabled) {
        const slackMessage = this.formatSlackNotification(submission, results);
        const slackResult = await this.callMCPTool('communication', 'sendSlackNotification', {
          message: slackMessage,
          priority: results.crm?.leadScore && results.crm.leadScore >= 70 ? 'high' : 'normal',
        });

        if (slackResult.error) {
          errors.push(`Slack notification failed: ${slackResult.error}`);
          results.communication = { slackNotificationSent: false };
        } else {
          results.communication = { slackNotificationSent: true };
          console.log(`Team notification sent for ${submission.firstName} ${submission.lastName}`);
        }
      }
    } catch (error) {
      errors.push(`Communication workflow error: ${error instanceof Error ? error.message : String(error)}`);
      results.communication = { slackNotificationSent: false };
    }

    // 5. Newsletter Subscription (if opted in)
    try {
      if (submission.newsletter === 'yes' && externalServiceConfig.email.gmail.enabled) {
        const newsletterResult = await this.callMCPTool('email', 'addToNewsletter', {
          email: submission.email,
          firstName: submission.firstName,
          lastName: submission.lastName,
          source: 'contact_form',
        });

        if (!newsletterResult.error) {
          console.log(`${submission.firstName} ${submission.lastName} added to newsletter`);
        }
      }
    } catch (error) {
      errors.push(`Newsletter workflow error: ${error instanceof Error ? error.message : String(error)}`);
    }

    // 6. Schedule Follow-up Email Sequence
    try {
      if (externalServiceConfig.email.gmail.enabled) {
        const sequenceResult = await this.callMCPTool('email', 'scheduleEmailSequence', {
          submissionId: submission.id,
          sequenceType: 'nurture',
        });

        if (!sequenceResult.error) {
          console.log(`Email nurture sequence scheduled for ${submission.firstName} ${submission.lastName}`);
        }
      }
    } catch (error) {
      errors.push(`Email sequence error: ${error instanceof Error ? error.message : String(error)}`);
    }

    const success = errors.length === 0 || Boolean(results.email?.welcomeEmailSent || results.crm?.contactSynced);
    
    console.log(`MCP workflow completed for submission ${submission.id}. Success: ${success}, Errors: ${errors.length}`);

    return {
      success,
      results,
      errors,
    };
  }

  private formatSlackNotification(submission: ContactSubmission, results: MCPWorkflowResult['results']): string {
    const leadScore = results.crm?.leadScore || 0;
    const priority = leadScore >= 70 ? '🔥 HIGH PRIORITY' : leadScore >= 40 ? '⚡ MEDIUM' : '📝 NEW';
    
    let message = `${priority} - New Event Inquiry\n\n`;
    message += `**${submission.firstName} ${submission.lastName}**\n`;
    message += `📧 ${submission.email}\n`;
    
    if (submission.phone) {
      message += `📞 ${submission.phone}\n`;
    }
    
    message += `🎉 Event: ${submission.eventType}\n`;
    
    if (submission.guestCount) {
      message += `👥 Guests: ${submission.guestCount}\n`;
    }
    
    if (submission.eventDate) {
      message += `📅 Date: ${submission.eventDate}\n`;
    }
    
    if (submission.budget) {
      message += `💰 Budget: ${submission.budget}\n`;
    }
    
    if (submission.location) {
      message += `📍 Location: ${submission.location}\n`;
    }
    
    message += `\n💬 Message: ${submission.message}\n`;
    
    if (leadScore > 0) {
      message += `\n📊 Lead Score: ${leadScore}/100\n`;
    }
    
    if (results.calendar?.availabilityChecked) {
      const available = !results.calendar.conflicts || results.calendar.conflicts.length === 0;
      message += `📆 Availability: ${available ? '✅ Available' : '⚠️ Conflicts detected'}\n`;
    }
    
    if (results.crm?.hubspotContactId) {
      message += `🔗 HubSpot Contact ID: ${results.crm.hubspotContactId}\n`;
    }
    
    return message;
  }
}

export const mcpWorkflow = new MCPWorkflowOrchestrator();