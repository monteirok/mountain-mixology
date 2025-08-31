'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity, 
  Users, 
  Mail, 
  Calendar, 
  CreditCard, 
  Database,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface ContactSubmission {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  eventType: string;
  guestCount?: string;
  eventDate?: string;
  budget?: string;
  location?: string;
  message: string;
  newsletter?: string;
  createdAt: string;
}

interface MCPStatus {
  status: string;
  servers: Record<string, { enabled: boolean; description: string }>;
  lastUpdated: string;
}

interface WorkflowResult {
  success: boolean;
  submissionId: number;
  workflow: {
    success: boolean;
    results: {
      email?: { welcomeEmailSent: boolean; messageId?: string };
      crm?: { contactSynced: boolean; hubspotContactId?: string; leadScore?: number };
      calendar?: { availabilityChecked: boolean; conflicts?: any[] };
      communication?: { slackNotificationSent: boolean };
    };
    errors: string[];
  };
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [mcpStatus, setMcpStatus] = useState<MCPStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load contact submissions
      const submissionsResponse = await fetch('/api/contact');
      if (submissionsResponse.ok) {
        const submissionsData = await submissionsResponse.json();
        setSubmissions(submissionsData);
      }

      // Load MCP status
      const statusResponse = await fetch('/api/mcp/status');
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setMcpStatus(statusData);
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerWorkflow = async (submissionId: number) => {
    try {
      setTriggering(submissionId);
      
      const response = await fetch(`/api/contact/${submissionId}/workflow`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const result: WorkflowResult = await response.json();
        
        toast({
          title: 'Workflow Triggered',
          description: `MCP workflow completed for submission ${submissionId}. ${result.workflow.errors.length > 0 ? `${result.workflow.errors.length} errors occurred.` : 'No errors.'}`,
          variant: result.workflow.success ? 'default' : 'destructive',
        });
      } else {
        throw new Error('Failed to trigger workflow');
      }
    } catch (error) {
      console.error('Failed to trigger workflow:', error);
      toast({
        title: 'Error',
        description: 'Failed to trigger MCP workflow',
        variant: 'destructive',
      });
    } finally {
      setTriggering(null);
    }
  };

  const getServerIcon = (serverName: string) => {
    switch (serverName) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'crm': return <Users className="h-4 w-4" />;
      case 'calendar': return <Calendar className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'contact': return <Database className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const recentSubmissions = submissions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const todaySubmissions = submissions.filter(
    s => new Date(s.createdAt).toDateString() === new Date().toDateString()
  );

  const highValueLeads = submissions.filter(
    s => s.budget && (s.budget.includes('$5,000') || s.budget.includes('$10,000') || s.budget.includes('over-10000'))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-mountain-gold" />
            <span className="ml-2 text-lg">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mountain Mixology Admin
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              MCP Server Dashboard & Contact Management
            </p>
          </div>
          <Button onClick={loadData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
              <p className="text-xs text-muted-foreground">
                {todaySubmissions.length} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High-Value Leads</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{highValueLeads.length}</div>
              <p className="text-xs text-muted-foreground">
                $5K+ budget inquiries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MCP Servers</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mcpStatus ? Object.keys(mcpStatus.servers).length : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Active integrations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              {mcpStatus?.status === 'active' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mcpStatus?.status === 'active' ? 'Online' : 'Offline'}
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated: {mcpStatus ? new Date(mcpStatus.lastUpdated).toLocaleTimeString() : 'N/A'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="submissions">Contact Submissions</TabsTrigger>
            <TabsTrigger value="servers">MCP Servers</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">
                            {submission.firstName} {submission.lastName}
                          </h3>
                          <Badge variant="outline">
                            {submission.eventType}
                          </Badge>
                          {submission.budget && (
                            <Badge variant={submission.budget.includes('$5,000') || submission.budget.includes('$10,000') || submission.budget.includes('over-10000') ? 'default' : 'secondary'}>
                              {submission.budget}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {submission.email} • {submission.phone}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {submission.message.substring(0, 100)}...
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(submission.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => triggerWorkflow(submission.id)}
                          disabled={triggering === submission.id}
                          className="gap-2"
                        >
                          {triggering === submission.id ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <Activity className="h-3 w-3" />
                          )}
                          Trigger Workflow
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mcpStatus && Object.entries(mcpStatus.servers).map(([serverName, server]) => (
                <Card key={serverName}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
                      {getServerIcon(serverName)}
                      {serverName} Server
                    </CardTitle>
                    {server.enabled ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {server.description}
                    </p>
                    <Badge variant={server.enabled ? 'default' : 'destructive'} className="mt-2">
                      {server.enabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>MCP Workflow Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Email Automation</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Sends welcome emails and nurture sequences automatically
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Users className="h-5 w-5 text-green-500" />
                    <div>
                      <h4 className="font-medium">CRM Integration</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Syncs contacts to HubSpot with lead scoring and deal creation
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <div>
                      <h4 className="font-medium">Calendar Integration</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Checks availability and provides seasonal pricing
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <div>
                      <h4 className="font-medium">Team Notifications</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Sends Slack notifications for high-priority leads
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}