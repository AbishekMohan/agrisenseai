#!/usr/bin/env node

const http = require('http');

async function testConnection(host, port) {
  console.log(`\n Testing connection to ${host}:${port}`);
  
  return new Promise((resolve) => {
    const request = http.get(`http://${host}:${port}/`, (response) => {
      console.log(`  ✓ Connected! Status: ${response.statusCode}`);
      resolve(true);
    }).on('error', (error) => {
      console.log(`  ✗ Failed: ${error.message}`);
      resolve(false);
    });
    
    // Set timeout
    request.setTimeout(3000);
    request.on('timeout', () => {
      request.destroy();
      console.log(`  ✗ Timeout`);
      resolve(false);
    });
  });
}

async function test() {
  console.log('=== Testing Various Connection Methods ===\n');
  
  await testConnection('localhost', 9002);
  await testConnection('127.0.0.1', 9002);
  await testConnection('[::1]', 9002);
  await testConnection('::1', 9002);
  
  console.log('\nDone.');
}

test();
