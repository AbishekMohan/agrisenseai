#!/usr/bin/env node

/**
 * API Test Script for AgriSense Chatbot
 * Run this script to test all API endpoints
 * 
 * Usage: node test-api.js
 */

const BASE_URL = 'http://localhost:9002/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

async function testEndpoint(name, endpoint, method = 'GET', body = null) {
  console.log(`\n${colors.blue}Testing: ${name}${colors.reset}`);
  console.log(`Endpoint: ${method} ${endpoint}`);
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
      console.log('Request body:', JSON.stringify(body, null, 2));
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`${colors.green}✓ Success (${response.status})${colors.reset}`);
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log(`${colors.red}✗ Error (${response.status})${colors.reset}`);
      console.log('Error:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log(`${colors.red}✗ Request failed${colors.reset}`);
    console.log('Error:', error.message);
  }
}

async function runTests() {
  console.log(`${colors.yellow}=== AgriSense API Tests ===${colors.reset}`);
  console.log(`Base URL: ${BASE_URL}\n`);
  
  // Test 1: Health checks
  console.log(`\n${colors.yellow}--- Health Checks ---${colors.reset}`);
  await testEndpoint('Chat Health Check', '/chat', 'GET');
  await testEndpoint('Recommendations Health Check', '/recommendations', 'GET');
  await testEndpoint('Diagnose Health Check', '/diagnose', 'GET');
  
  // Test 2: Chat endpoint
  console.log(`\n${colors.yellow}--- Chat API Tests ---${colors.reset}`);
  await testEndpoint(
    'Chat - Simple Question',
    '/chat',
    'POST',
    {
      question: 'What is the best time to plant wheat in India?',
      language: 'English'
    }
  );
  
  await testEndpoint(
    'Chat - Hindi Question',
    '/chat',
    'POST',
    {
      question: 'मिट्टी की उर्वरता कैसे बढ़ाएं?',
      language: 'Hindi'
    }
  );
  
  // Test 3: Recommendations endpoint
  console.log(`\n${colors.yellow}--- Recommendations API Tests ---${colors.reset}`);
  await testEndpoint(
    'Recommendations - Full Data',
    '/recommendations',
    'POST',
    {
      soilMoisture: 45,
      soilTemperature: 25,
      soilPh: 6.5,
      nutrientLevel: 70,
      weatherForecast: 'Mostly sunny for the next 3 days',
      cropType: 'Wheat',
      location: 'Punjab, India',
      language: 'English'
    }
  );
  
  // Test 4: Error handling
  console.log(`\n${colors.yellow}--- Error Handling Tests ---${colors.reset}`);
  await testEndpoint(
    'Chat - Missing Question',
    '/chat',
    'POST',
    {
      language: 'English'
    }
  );
  
  await testEndpoint(
    'Recommendations - Missing Data',
    '/recommendations',
    'POST',
    {
      soilMoisture: 45
    }
  );
  
  console.log(`\n${colors.yellow}=== Tests Complete ===${colors.reset}\n`);
}

// Run tests
runTests().catch(console.error);
