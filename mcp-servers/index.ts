#!/usr/bin/env node

import { mcpRegistry } from './mcp-registry.js';
import { getEnabledServers } from './mcp-config.js';

async function startMCPServers() {
  console.log('Starting Mountain Mixology MCP Servers...');
  
  const enabledServers = getEnabledServers();
  console.log('Enabled servers:', enabledServers);

  if (enabledServers.length === 0) {
    console.log('No MCP servers are enabled. Check your environment configuration.');
    return;
  }

  try {
    await mcpRegistry.initializeAllServers();
    
    const runningServers = mcpRegistry.getRunningServers();
    const failedServers = mcpRegistry.getFailedServers();
    
    console.log(`\n✅ Successfully started ${runningServers.length} MCP servers:`);
    runningServers.forEach(server => console.log(`  - ${server}`));
    
    if (failedServers.length > 0) {
      console.log(`\n❌ Failed to start ${failedServers.length} MCP servers:`);
      failedServers.forEach(server => {
        const instance = mcpRegistry.getServerStatus(server);
        console.log(`  - ${server}: ${instance?.error || 'Unknown error'}`);
      });
    }

    console.log('\nMCP servers are ready to accept connections.');
    
  } catch (error) {
    console.error('Failed to start MCP servers:', error);
    process.exit(1);
  }
}

async function stopMCPServers() {
  console.log('Stopping MCP servers...');
  try {
    await mcpRegistry.stopAllServers();
    console.log('All MCP servers stopped');
  } catch (error) {
    console.error('Error stopping MCP servers:', error);
  }
}

process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  await stopMCPServers();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  await stopMCPServers();
  process.exit(0);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  startMCPServers().catch(console.error);
}

export { mcpRegistry, startMCPServers, stopMCPServers };