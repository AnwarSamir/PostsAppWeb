# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### Kubernetes Deployment (GKE)

This repository includes Kubernetes configuration files for deploying to Google Kubernetes Engine (GKE).

#### Prerequisites

- Google Cloud Platform account
- Google Kubernetes Engine cluster
- `kubectl` CLI
- `kustomize` CLI

#### Configuration Files

The Kubernetes configuration files are located in the `k8s` directory:

- `deployment.yml`: Defines the deployment configuration
- `service.yml`: Defines the service and ingress configuration
- `kustomization.yml`: Defines the base kustomization

Environment-specific configurations are in the `k8s/overlays` directory:

- `dev`: Development environment configuration
- `prod`: Production environment configuration

#### Deployment

To deploy to the development environment:

```bash
kubectl apply -k k8s/overlays/dev
```

To deploy to the production environment:

```bash
kubectl apply -k k8s/overlays/prod
```

#### CI/CD

This repository includes a GitHub Actions workflow for continuous deployment to GKE. The workflow is defined in `.github/workflows/deploy-gke.yml`.

To use the workflow, you need to set the following secrets in your GitHub repository:

- `GCP_PROJECT_ID`: Your Google Cloud Platform project ID
- `GCP_SA_KEY`: Your Google Cloud Platform service account key (JSON)

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
