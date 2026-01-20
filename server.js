// EdgeOne Deployment Entry Point
// This file delegates execution to the Next.js standalone server
// which provides the actual runtime environment.

const path = require('path');

// The standalone build is located in .next/standalone
// We need to resolve it relative to the current working directory
const standaloneServerPath = path.join(process.cwd(), '.next', 'standalone', 'server.js');

try {
  console.log('Starting EdgeOne server proxy...');
  console.log(`Delegating to: ${standaloneServerPath}`);
  
  // Set hostname to 0.0.0.0 to bind to all interfaces (required for container environments)
  process.env.HOSTNAME = '0.0.0.0';
  
  require(standaloneServerPath);
} catch (error) {
  console.error('Failed to start standalone server:');
  console.error(error);
  process.exit(1);
}
