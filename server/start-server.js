console.log('Starting server...');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());

// Check environment variables
console.log('Environment variables:');
console.log('MONGODB_URL:', process.env.MONGODB_URL ? 'Set' : 'Not set');
console.log('PORT:', process.env.PORT);
console.log('TOKEN_SECRET:', process.env.TOKEN_SECRET ? 'Set' : 'Not set');

try {
  // Import and start the main server
  import('./index.js').then(() => {
    console.log('Server import successful');
  }).catch(err => {
    console.error('Server import failed:', err);
    process.exit(1);
  });
} catch (err) {
  console.error('Error starting server:', err);
  process.exit(1);
}