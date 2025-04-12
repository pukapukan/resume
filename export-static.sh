#!/bin/bash
echo "Preparing your static portfolio site for export..."

# Clean any existing export directory
echo "Cleaning previous export artifacts..."
rm -rf docs

# Ensure we have a fresh static build
echo "Rebuilding static assets to ensure latest changes..."
./build-static.sh

# Create a new export directory
echo "Creating export directory..."
mkdir -p docs
cp -r dist/public/* docs/

echo "Export complete! Your portfolio is ready in the 'docs' directory."
echo "These files will be used by GitHub Pages for deployment."
echo ""
echo "Files in the export directory:"
ls -la docs/