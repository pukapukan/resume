# Deploying Your Portfolio as a Static Website

This document explains how to deploy your portfolio website as a completely static application. Since the portfolio doesn't require any backend APIs or server-side processing, it can be deployed on any static web hosting service.

## Step 1: Build the Static Files

Run the build script to generate the static files:

```bash
./build-static.sh
```

This will create optimized production files in the `dist/public` directory.

## Step 2: Deploy to a Static Hosting Service

You can deploy these files to any static hosting service:

### Option 1: GitHub Pages

1. Create a GitHub repository for your portfolio
2. Push your code to the repository
3. Create a `.github/workflows/deploy.yml` file to automate deployment
4. GitHub Pages will serve your site at `https://yourusername.github.io/repository-name`

### Option 2: Netlify

1. Create an account on [Netlify](https://www.netlify.com/)
2. Drag and drop the `dist/public` folder onto the Netlify site
3. Your site will be deployed to a Netlify subdomain

### Option 3: Vercel

1. Create an account on [Vercel](https://vercel.com/)
2. Install the Vercel CLI: `npm i -g vercel`
3. Run `vercel` from the `dist/public` directory
4. Follow the prompts to deploy your site

### Option 4: Amazon S3

1. Create an S3 bucket with static website hosting enabled
2. Upload the contents of the `dist/public` directory to the bucket
3. Configure the bucket policy to allow public access
4. Your site will be available at the S3 website endpoint

## Custom Domain Configuration

To use your own domain name with any of these services:

1. Purchase a domain from a domain registrar (like Namecheap, GoDaddy, etc.)
2. Configure the DNS settings to point to your hosting service
3. Follow the hosting service's instructions for setting up a custom domain

## Keeping Your Site Updated

When you make changes to your portfolio:

1. Make your changes in the source code
2. Run the build script again: `./build-static.sh`
3. Upload the updated files to your hosting service