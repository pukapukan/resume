#!/bin/bash
echo "Preparing your static portfolio site for export..."

# Ensure we have a static build
if [ ! -d "dist/public" ]; then
  echo "Static build not found. Building first..."
  ./build-static.sh
fi

# Create an export directory
echo "Creating export directory..."
mkdir -p portfolio-export
cp -r dist/public/* portfolio-export/

echo "Export complete! Your portfolio is ready in the 'portfolio-export' directory."
echo "You can download these files and upload them to any static web hosting service."
echo ""
echo "Files in the export directory:"
ls -la portfolio-export/