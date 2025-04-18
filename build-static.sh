#!/bin/bash
echo "Building static version of portfolio website..."

# Clean existing build artifacts
echo "Cleaning previous build artifacts..."
rm -rf dist

# Run the Vite build process to generate the static files
echo "Running build process..."
npx vite build

# Copy any additional assets needed
echo "Copying additional assets..."
mkdir -p dist/public/assets
cp -r client/public/* dist/public/ 2>/dev/null || :

echo "Static build complete! Files are in the dist/public directory."
echo "To deploy, upload the contents of the dist/public directory to your web hosting service."