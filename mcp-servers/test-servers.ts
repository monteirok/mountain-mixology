#!/usr/bin/env node

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

const servers = [
  'contact',
  'quote', 
  'analytics',
  'crm',
  'calendar',
  'content',
  'inventory',
  'seo'
];

async function testServer(serverName: string): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`Testing ${serverName} server...`);
    
    const child = spawn('tsx', [`mcp-servers/${serverName}-server.ts`], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let hasError = false;

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      const error = data.toString();
      if (!error.includes('ExperimentalWarning')) {
        console.error(`${serverName} error:`, error);
        hasError = true;
      }
    });

    // Test basic functionality
    setTimeout(2000).then(() => {
      if (!hasError) {
        console.log(`✅ ${serverName} server started successfully`);
        resolve(true);
      } else {
        console.log(`❌ ${serverName} server failed to start`);
        resolve(false);
      }
      child.kill();
    });

    child.on('error', (error) => {
      console.error(`${serverName} spawn error:`, error);
      resolve(false);
    });
  });
}

async function testAllServers() {
  console.log('Testing all MCP servers...\n');
  
  const results = [];
  
  for (const server of servers) {
    const success = await testServer(server);
    results.push({ server, success });
    await setTimeout(1000); // Wait between tests
  }
  
  console.log('\n=== Test Results ===');
  results.forEach(({ server, success }) => {
    console.log(`${success ? '✅' : '❌'} ${server}`);
  });
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n${successCount}/${results.length} servers passed tests`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testAllServers().catch(console.error);
}