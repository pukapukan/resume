# Jason Park Portfolio

A modern personal portfolio website showcasing professional experience, skills, and projects.

## Features

- Responsive design using Tailwind CSS
- Subtle, elegant animations inspired by Stripe.com
- Dark/light theme support
- Interactive background effects
- Optimized performance

## Getting Started

### Development

To run the development server:

```bash
npm run dev
```

This will start the development server at http://localhost:5000.

### Building for Static Deployment

This portfolio can be built as a completely static website, eliminating the need for a backend server.

To build the static files:

```bash
./build-static.sh
```

This will create optimized production files in the `dist/public` directory.

### Previewing Static Build

To preview the static build:

```bash
./preview-static.sh
```

This will serve the static files locally at http://localhost:3000.

### Exporting for Deployment

To create a downloadable zip file of your static build:

```bash
./export-static.sh
```

This will create a `portfolio-static.zip` file that you can download and deploy to any static web hosting service.

## Deployment Options

See `deploy-instructions.md` for detailed instructions on deploying your static portfolio to various platforms:

- GitHub Pages
- Netlify
- Vercel
- Amazon S3
- And more!

## Technology Stack

- React
- Tailwind CSS
- Framer Motion
- Three.js
- Vite

## License

MIT