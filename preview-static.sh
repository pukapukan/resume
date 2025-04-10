#!/bin/bash
echo "Starting preview server for static build..."

# Check if the build exists
if [ ! -d "dist/public" ]; then
  echo "Static build not found. Building first..."
  ./build-static.sh
fi

# Create a simple server.js file to serve the static content
cat > preview-server.js << 'EOL'
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

// Serve static files from the dist/public directory
app.use(express.static(join(__dirname, 'dist/public')));

// Handle all routes by serving the index.html file (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist/public/index.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Preview server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});
EOL

# Run the server
npx tsx preview-server.js