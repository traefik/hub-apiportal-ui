# Traefik Hub Portal UI

Welcome to Traefik Hub's API Portal Template repository! 
This repository contains a starter template for customizing the UI of your API portal.

This template provides a starting point for building your own custom API portal UI. 
It includes a set of HTML, CSS, and JavaScript files that you can customize to match your branding and requirements.

## Getting started

To get started, simply fork this repository and modify the template to your liking. 
Once modified you will need to: 
- Build the docker image using `make image`
- Create a Kuberentes Deployment using the new image
- Expose this deployment behind a Kuberentes Service
- Update your APIPortal and set the `spec.ui.service` field to the Kubernetes service

If you have any questions or feedback, please feel free to reach out to us via our website or GitHub issues. 
We hope you find this template useful and look forward to seeing what you build with it!

## Development

Run the development server:

```bash
yarn start
```

App is running at [http://localhost:3000](http://localhost:3000) in dev mode.

The local setup uses a Service Worker to intercept HTTP calls and inject a mocked reply. 
This allows developers to test the application with mocked data and simulate different scenarios without relying on external APIs or services. 
Note that the Service Worker is only active in development mode.

## Testing

Run units tests:

```bash
yarn test
```