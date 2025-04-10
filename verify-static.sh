#!/bin/bash
echo "Verifying your static portfolio site..."

# Always rebuild to ensure latest changes
echo "Rebuilding static assets to ensure latest changes..."
./build-static.sh

# Verify important files exist
echo "Checking for critical files..."

MISSING_FILES=0

if [ ! -f "dist/public/index.html" ]; then
  echo "❌ Missing index.html"
  MISSING_FILES=$((MISSING_FILES + 1))
else
  echo "✅ index.html found"
fi

if [ ! -d "dist/public/assets" ]; then
  echo "❌ Missing assets directory"
  MISSING_FILES=$((MISSING_FILES + 1))
else
  echo "✅ assets directory found"
  
  # Check for CSS file
  if ls dist/public/assets/*.css 1> /dev/null 2>&1; then
    echo "✅ CSS file found"
  else
    echo "❌ Missing CSS file"
    MISSING_FILES=$((MISSING_FILES + 1))
  fi
  
  # Check for JS file
  if ls dist/public/assets/*.js 1> /dev/null 2>&1; then
    echo "✅ JavaScript file found"
  else
    echo "❌ Missing JavaScript file"
    MISSING_FILES=$((MISSING_FILES + 1))
  fi
fi

if [ $MISSING_FILES -eq 0 ]; then
  echo "✅ All critical files are present!"
  echo "Your static build appears to be complete and ready for deployment."
  echo "Use ./export-static.sh to prepare the files for upload."
else
  echo "❌ Some critical files are missing. The build may not be complete."
  echo "Try running ./build-static.sh again to regenerate the build."
fi