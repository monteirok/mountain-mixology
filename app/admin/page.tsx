'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Database,
  Mail,
  RefreshCw,
  TrendingUp,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

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

type WorkflowCalendarResult = {
  availabilityChecked: boolean;
  conflicts?: unknown[];
};

type WorkflowResult = {
  success: boolean;
  submissionId: number;
  workflow: {
    success: boolean;
    results: {
      email?: { welcomeEmailSent: boolean; messageId?: string };
      crm?: { contactSynced: boolean; hubspotContactId?: string; leadScore?: number };
      calendar?: WorkflowCalendarResult;
      communication?: { slackNotificationSent: boolean };
    };
    errors: string[];
  };
};

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [mcpStatus, setMcpStatus] = useState<MCPStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<number | null>(null);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const submissionsResponse = await fetch('/api/contact');
      if (submissionsResponse.ok) {
        const submissionsData: ContactSubmission[] = await submissionsResponse.json();
        setSubmissions(submissionsData);
      }

      const statusResponse = await fetch('/api/mcp/status');
      if (statusResponse.ok) {
        const statusData: MCPStatus = await statusResponse.json();
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
  }, [toast]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

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
          description: `MCP workflow completed for submission ${submissionId}. ${
            result.workflow.errors.length > 0
              ? `${result.workflow.errors.length} errors occurred.`
              : 'No errors.'
          }`,
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
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'crm':
        return <Users className="h-4 w-4" />;
      case 'calendar':
        return <Calendar className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      case 'contact':
        return <Database className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const recentSubmissions = useMemo(
    () =>
      [...submissions]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10),
    [submissions]
  );

  const todaySubmissions = useMemo(
    () =>
      submissions.filter(
        (submission) => new Date(submission.createdAt).toDateString() === new Date().toDateString()
      ),
    [submissions]
  );

  const highValueLeads = useMemo(
    () =>
      submissions.filter(
        (submission) =>
          submission.budget &&
          (submission.budget.includes('$5,000') ||
            submission.budget.includes('$10,000') ||
            submission.budget.includes('over-10000'))
      ),
    [submissions]
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
              <p className="text-xs text-muted-foreground">{todaySubmissions.length} today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High-Value Leads</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{highValueLeads.length}</div>
              <p className="text-xs text-muted-foreground">Potential premium events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Servers</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mcpStatus ? Object.values(mcpStatus.servers).filter((server) => server.enabled).length : 0}
              </div>
              <p className="text-xs text-muted-foreground">Out of {mcpStatus ? Object.keys(mcpStatus.servers).length : 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Synced</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mcpStatus ? new Date(mcpStatus.lastUpdated).toLocaleString() : 'No data'}
              </div>
              <p className="text-xs text-muted-foreground">System status</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
            <TabsTrigger value="servers">MCP Servers</TabsTrigger>
          </TabsList>
          <TabsContent value="submissions" className="space-y-4">
            {recentSubmissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-xl">
                      {submission.firstName} {submission.lastName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{submission.email}</p>
                  </div>
                  <Badge variant="outline">{submission.eventType}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold">Event Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>Guest Count: {submission.guestCount ?? 'Not specified'}</div>
                      <div>Event Date: {submission.eventDate ?? 'Not specified'}</div>
                      <div>Budget: {submission.budget ?? 'Not specified'}</div>
                      <div>Location: {submission.location ?? 'Not specified'}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Message</h4>
                    <p className="text-sm text-muted-foreground">{submission.message}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      Submitted {new Date(submission.createdAt).toLocaleString()}
                    </Badge>
                    <Button
                      variant="outline"
                      onClick={() => triggerWorkflow(submission.id)}
                      disabled={triggering === submission.id}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      {triggering === submission.id ? 'Running...' : 'Trigger MCP Workflow'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="servers">
            <Card>
              <CardHeader>
                <CardTitle>MCP Server Status</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Last updated: {mcpStatus ? new Date(mcpStatus.lastUpdated).toLocaleString() : 'No data available'}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mcpStatus ? (
                    Object.entries(mcpStatus.servers).map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-lg border p-4 flex items-start justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            value.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {getServerIcon(key)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold uppercase tracking-wide">{key}</p>
                            <p className="text-sm text-muted-foreground">{value.description}</p>
                          </div>
                        </div>
                        {value.enabled ? (
                          <Badge className="bg-emerald-100 text-emerald-700" variant="outline">
                            <CheckCircle className="mr-1 h-3.5 w-3.5" /> Active
                          </Badge>
                        ) : (
                          <Badge className="bg-rose-100 text-rose-700" variant="outline">
                            <AlertTriangle className="mr-1 h-3.5 w-3.5" /> Issue
                          </Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-muted-foreground">
                      No server status available.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
