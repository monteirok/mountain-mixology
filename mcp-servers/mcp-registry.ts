import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  mcpServerConfigs, 
  getEnabledServers, 
  getServerInitializationOrder,
  validateServerDependencies 
} from './mcp-config.js';

export interface MCPServerInstance {
  name: string;
  server: Server;
  transport: StdioServerTransport;
  status: 'initializing' | 'running' | 'stopped' | 'error';
  error?: string;
}

export class MCPServerRegistry {
  private servers: Map<string, MCPServerInstance> = new Map();
  private initializationPromises: Map<string, Promise<void>> = new Map();

  async initializeServer(serverName: string): Promise<void> {
    if (this.initializationPromises.has(serverName)) {
      return this.initializationPromises.get(serverName);
    }

    const promise = this._initializeServer(serverName);
    this.initializationPromises.set(serverName, promise);
    return promise;
  }

  private async _initializeServer(serverName: string): Promise<void> {
    try {
      const config = mcpServerConfigs[serverName];
      if (!config) {
        throw new Error(`Server configuration not found: ${serverName}`);
      }

      if (!config.enabled) {
        console.log(`Server ${serverName} is disabled, skipping initialization`);
        return;
      }

      if (!validateServerDependencies(serverName)) {
        throw new Error(`Dependencies not met for server: ${serverName}`);
      }

      console.log(`Initializing MCP server: ${serverName}`);

      const server = new Server(
        {
          name: config.name,
          version: config.version,
        },
        {
          capabilities: {
            resources: {},
            tools: {},
          },
        }
      );

      const transport = new StdioServerTransport();
      
      const instance: MCPServerInstance = {
        name: serverName,
        server,
        transport,
        status: 'initializing',
      };

      this.servers.set(serverName, instance);

      await this.loadServerImplementation(serverName, server);
      await server.connect(transport);

      instance.status = 'running';
      console.log(`MCP server ${serverName} is now running`);

    } catch (error) {
      const instance = this.servers.get(serverName);
      if (instance) {
        instance.status = 'error';
        instance.error = error instanceof Error ? error.message : String(error);
      }
      console.error(`Failed to initialize server ${serverName}:`, error);
      throw error;
    }
  }

  private async loadServerImplementation(serverName: string, server: Server): Promise<void> {
    try {
      const modulePath = `./${serverName}-server.js`;
      const serverModule = await import(modulePath);
      
      if (serverModule.setupServer) {
        await serverModule.setupServer(server);
      } else {
        console.warn(`No setupServer function found in ${modulePath}`);
      }
    } catch (error) {
      console.warn(`Could not load server implementation for ${serverName}:`, error);
    }
  }

  async initializeAllServers(): Promise<void> {
    const initOrder = getServerInitializationOrder();
    console.log('Server initialization order:', initOrder);

    for (const serverName of initOrder) {
      try {
        await this.initializeServer(serverName);
      } catch (error) {
        console.error(`Failed to initialize ${serverName}, continuing with other servers:`, error);
      }
    }
  }

  getServerStatus(serverName: string): MCPServerInstance | undefined {
    return this.servers.get(serverName);
  }

  getAllServerStatuses(): Record<string, MCPServerInstance> {
    const statuses: Record<string, MCPServerInstance> = {};
    for (const [name, instance] of this.servers) {
      statuses[name] = instance;
    }
    return statuses;
  }

  async stopServer(serverName: string): Promise<void> {
    const instance = this.servers.get(serverName);
    if (!instance) {
      throw new Error(`Server not found: ${serverName}`);
    }

    try {
      await instance.server.close();
      instance.status = 'stopped';
      console.log(`Server ${serverName} stopped`);
    } catch (error) {
      instance.status = 'error';
      instance.error = error instanceof Error ? error.message : String(error);
      throw error;
    }
  }

  async stopAllServers(): Promise<void> {
    const stopPromises = Array.from(this.servers.keys()).map(
      (serverName) => this.stopServer(serverName).catch(console.error)
    );
    
    await Promise.all(stopPromises);
  }

  getRunningServers(): string[] {
    return Array.from(this.servers.entries())
      .filter(([, instance]) => instance.status === 'running')
      .map(([name]) => name);
  }

  getFailedServers(): string[] {
    return Array.from(this.servers.entries())
      .filter(([, instance]) => instance.status === 'error')
      .map(([name]) => name);
  }
}

export const mcpRegistry = new MCPServerRegistry();