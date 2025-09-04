#!/usr/bin/env node

/**
 * MCP Server Test Script
 * Tests the MCP server by sending a simple request
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing MCP Server...\n');

// Test request to list tools
const testRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/list",
  params: {}
};

const serverPath = join(__dirname, 'build', 'server.js');

console.log(`📡 Starting server: ${serverPath}`);

const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

server.stdout.on('data', (data) => {
  output += data.toString();
});

server.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

server.on('close', (code) => {
  console.log(`\n📊 Server exited with code: ${code}`);
  
  if (errorOutput) {
    console.log('📝 Server output:');
    console.log(errorOutput);
  }
  
  if (output) {
    console.log('📤 Server response:');
    console.log(output);
  }
  
  if (code === 0) {
    console.log('✅ Server test completed successfully');
  } else {
    console.log('❌ Server test failed');
  }
});

// Send test request after a short delay
setTimeout(() => {
  console.log('📤 Sending test request...');
  server.stdin.write(JSON.stringify(testRequest) + '\n');
  
  // Close stdin after sending request
  setTimeout(() => {
    server.stdin.end();
  }, 1000);
}, 2000);

// Kill server after 10 seconds if it doesn't exit
setTimeout(() => {
  if (!server.killed) {
    console.log('⏰ Test timeout - killing server');
    server.kill();
  }
}, 10000);
