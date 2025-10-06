// Client-side MCP utilities
export class MCPClient {
  private baseUrl: string;

  constructor(baseUrl = '/api/mcp') {
    this.baseUrl = baseUrl;
  }

  async callTool<TResponse = unknown>(
    server: string,
    tool: string,
    args?: Record<string, unknown> | unknown[]
  ): Promise<TResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        server,
        tool,
        arguments: args,
      }),
    });

    if (!response.ok) {
      throw new Error(`MCP call failed: ${response.statusText}`);
    }

    return response.json() as Promise<TResponse>;
  }

  async getResource<TResponse = unknown>(
    server: string,
    resource: string
  ): Promise<TResponse> {
    const response = await fetch(
      `${this.baseUrl}?server=${server}&resource=${encodeURIComponent(resource)}`
    );

    if (!response.ok) {
      throw new Error(`MCP resource fetch failed: ${response.statusText}`);
    }

    return response.json() as Promise<TResponse>;
  }

  async getServerStatuses<TResponse = unknown>(): Promise<TResponse> {
    const response = await fetch(this.baseUrl);
    
    if (!response.ok) {
      throw new Error(`MCP status fetch failed: ${response.statusText}`);
    }

    return response.json() as Promise<TResponse>;
  }
}

export const mcpClient = new MCPClient();
