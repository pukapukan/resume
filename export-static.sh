#!/bin/bash
echo "Preparing your static portfolio site for export..."

# Clean any existing export directory
echo "Cleaning previous export artifacts..."
rm -rf portfolio-export

# Ensure we have a fresh static build
echo "Rebuilding static assets to ensure latest changes..."
./build-static.sh

# Create a new export directory
echo "Creating export directory..."
mkdir -p portfolio-export
cp -r dist/public/* portfolio-export/

echo "Export complete! Your portfolio is ready in the 'portfolio-export' directory."
echo "You can download these files and upload them to any static web hosting service."
echo ""
echo "Files in the export directory:"
ls -la portfolio-export/