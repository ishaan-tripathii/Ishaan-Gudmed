const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

// Configuration
const config = {
  backendUrl: '',
  frontendUrl: '',
  adminUrl: '',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex')
};

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promise-based question function
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Helper function to run commands
const runCommand = (command, cwd, silent = false) => {
  try {
    execSync(command, { cwd, stdio: silent ? 'ignore' : 'inherit' });
    return true;
  } catch (error) {
    console.error(`Failed to execute ${command}`, error);
    return false;
  }
};

// Check if command exists
const commandExists = (command) => {
  try {
    execSync(command, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// Validate environment
const validateEnvironment = async () => {
  console.log('Validating environment...');

  // Check for required commands
  if (!commandExists('git --version')) {
    throw new Error('Git is not installed. Please install Git first.');
  }
  if (!commandExists('node --version')) {
    throw new Error('Node.js is not installed. Please install Node.js first.');
  }
  if (!commandExists('npm --version')) {
    throw new Error('npm is not installed. Please install npm first.');
  }
  if (!commandExists('vercel --version')) {
    console.log('Installing Vercel CLI...');
    runCommand('npm install -g vercel');
  }

  // Check for git repository
  if (!fs.existsSync('.git')) {
    console.log('Initializing Git repository...');
    runCommand('git init');
  }

  // Check for MongoDB URI
  if (!config.mongodbUri) {
    config.mongodbUri = await question('Please enter your MongoDB URI: ');
  }

  console.log('Environment validation complete.');
};

// Update environment files
const updateEnvFiles = () => {
  console.log('Updating environment files...');

  // Create backend .env
  const backendEnv = `
NODE_ENV=production
PORT=5000
MONGODB_URI=${config.mongodbUri}
JWT_SECRET=${config.jwtSecret}
FRONTEND_URL=${config.frontendUrl}
ADMIN_URL=${config.adminUrl}
CORS_ORIGIN=${config.frontendUrl},${config.adminUrl}
    `.trim();

  // Create frontend .env
  const frontendEnv = `
REACT_APP_API_URL=${config.backendUrl}
REACT_APP_ENV=production
    `.trim();

  // Create admin .env
  const adminEnv = `
REACT_APP_API_URL=${config.backendUrl}
REACT_APP_ENV=production
PORT=3001
    `.trim();

  // Write files
  fs.writeFileSync(path.join(__dirname, 'backend', '.env.production'), backendEnv);
  fs.writeFileSync(path.join(__dirname, 'frontend', '.env.production'), frontendEnv);
  fs.writeFileSync(path.join(__dirname, 'admin-dashboard', '.env.production'), adminEnv);

  console.log('Environment files updated.');
};

// Deploy backend to Render
const deployBackend = async () => {
  console.log('Preparing backend deployment...');

  // Create render.yaml
  const renderConfig = `
services:
  - type: web
    name: gudmed-backend
    env: node
    buildCommand: npm ci --production
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        value: ${config.mongodbUri}
      - key: JWT_SECRET
        value: ${config.jwtSecret}
      - key: FRONTEND_URL
        value: ${config.frontendUrl}
      - key: ADMIN_URL
        value: ${config.adminUrl}
    healthCheckPath: /api/health
    autoDeploy: true
    `;

  fs.writeFileSync(path.join(__dirname, 'backend', 'render.yaml'), renderConfig);

  // Commit and push backend changes
  console.log('Deploying backend to Render...');
  runCommand('git add .', './backend');
  runCommand('git commit -m "Update deployment configuration [skip ci]"', './backend');
  runCommand('git push origin main', './backend');

  // Get backend URL
  config.backendUrl = await question('Please enter the Render backend URL (after deployment): ');
  console.log('Backend deployment complete.');
};

// Deploy frontend to Vercel
const deployFrontend = async () => {
  console.log('Deploying frontend to Vercel...');
  updateEnvFiles();

  // Create Vercel config
  const vercelConfig = {
    version: 2,
    builds: [{ src: 'package.json', use: '@vercel/node' }],
    routes: [{ src: '/(.*)', dest: '/' }]
  };

  fs.writeFileSync(path.join(__dirname, 'frontend', 'vercel.json'),
    JSON.stringify(vercelConfig, null, 2));

  if (runCommand('vercel --prod', './frontend')) {
    console.log('Frontend deployed successfully!');
    const url = execSync('vercel --prod --confirm', { cwd: './frontend' })
      .toString().trim();
    config.frontendUrl = url;
  }
};

// Deploy admin dashboard to Vercel
const deployAdmin = async () => {
  console.log('Deploying admin dashboard to Vercel...');
  updateEnvFiles();

  // Create Vercel config
  const vercelConfig = {
    version: 2,
    builds: [{ src: 'package.json', use: '@vercel/node' }],
    routes: [{ src: '/(.*)', dest: '/' }]
  };

  fs.writeFileSync(path.join(__dirname, 'admin-dashboard', 'vercel.json'),
    JSON.stringify(vercelConfig, null, 2));

  if (runCommand('vercel --prod', './admin-dashboard')) {
    console.log('Admin dashboard deployed successfully!');
    const url = execSync('vercel --prod --confirm', { cwd: './admin-dashboard' })
      .toString().trim();
    config.adminUrl = url;
  }
};

// Cleanup function
const cleanup = () => {
  console.log('Cleaning up...');

  // Remove temporary files
  const tempFiles = [
    'backend/.env.production',
    'frontend/.env.production',
    'admin-dashboard/.env.production'
  ];

  tempFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });

  // Close readline interface
  rl.close();
};

// Main deployment function
const deploy = async () => {
  try {
    console.log('Starting deployment process...');

    // Validate environment
    await validateEnvironment();

    // Install dependencies
    console.log('Installing dependencies...');
    runCommand('npm ci --production', './backend');
    runCommand('npm ci --production', './frontend');
    runCommand('npm ci --production', './admin-dashboard');

    // Deploy in sequence
    await deployBackend();
    await deployFrontend();
    await deployAdmin();

    // Final environment update
    updateEnvFiles();

    console.log('\nDeployment Summary:');
    console.log('------------------');
    console.log(`Backend URL: ${config.backendUrl}`);
    console.log(`Frontend URL: ${config.frontendUrl}`);
    console.log(`Admin Dashboard URL: ${config.adminUrl}`);

    console.log('\nNext steps:');
    console.log('1. Verify all services are running correctly');
    console.log('2. Test the real-time functionality');
    console.log('3. Check all environment variables are set correctly');

  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  } finally {
    cleanup();
  }
};

// Handle errors and cleanup
process.on('SIGINT', () => {
  console.log('\nDeployment interrupted.');
  cleanup();
  process.exit(0);
});

// Run deployment
deploy().catch(console.error); 