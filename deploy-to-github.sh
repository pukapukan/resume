#!/bin/bash
set -e

# Script to build the static site, export it, commit and push to GitHub
echo "Starting the build and deploy process for GitHub Pages..."

# 1. Build and export the static site
echo "Step 1: Building and exporting static site..."
./export-static.sh

# 2. Stage all changes including the portfolio-export directory
echo "Step 2: Staging changes for commit..."
git add .

# 3. Get a commit message from the user
echo "Step 3: Creating commit..."
echo "Enter a commit message (or press Enter for default message):"
read commit_message
if [ -z "$commit_message" ]; then
  commit_message="Update portfolio site build $(date '+%Y-%m-%d %H:%M:%S')"
fi

# 4. Commit the changes
git commit -m "$commit_message"

# 5. Push to GitHub
echo "Step 4: Pushing to GitHub repository..."
echo "Enter the branch name (default: main):"
read branch_name
if [ -z "$branch_name" ]; then
  branch_name="main"
fi

git push origin $branch_name

echo "Deployment complete! Your portfolio has been pushed to GitHub."
echo "If you've configured GitHub Pages correctly, your site should be live shortly."