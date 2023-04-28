<br/>

<div align="center" style="margin: 30px;">
<a href="https://hub.traefik.io/">
  <img src="https://doc.traefik.io/traefik-hub/assets/images/logos-traefik-hub-horizontal.svg"   style="width:250px;" align="center" />
</a>
<br />
<br />

<div align="center">
    <a href="https://hub.traefik.io">Log In</a> |
    <a href="https://doc.traefik.io/traefik-hub/">Documentation</a> |
</div>
</div>
<br />
<div align="center"><strong>Traefik Hub Portal UI</strong><br>Traefik Hub's API Portal Template<br>
<br />
<br />
</div>


Welcome to Traefik Hub's API Portal Template repository!
This repository contains a starter template for customizing the UI of your API Portal.

This template provides a starting point for building your own custom API Portal UI.
It includes a set of HTML, CSS, and JavaScript files that you can customize to match your branding and requirements.

## Getting started

To get started, fork this repository and modify the template to your liking.
Once modified, you will need to:

- Build the Docker image using `make image`
- Create a Kubernetes Deployment using the new image
- Expose this deployment behind a Kubernetes Service
- Update your APIPortal and set the `spec.ui.service` field to the Kubernetes service

A sample Deployment and Service can be found in [manifest.yaml](./manifest.yaml "Link to example manifest file").

If you have any questions or feedback, please feel free to reach out to us via our website or GitHub issues.
We hope you find this template useful and look forward to seeing what you build with it!

## Development

1. Installing dependencies:

```shell
yarn install
```

2. Run the development server:

```shell
yarn start
```

App is running at [http://localhost:3000](http://localhost:3000 "Link to localhost on port 3000") in dev mode.

The local setup uses a Service Worker to intercept HTTP calls and inject a mocked reply.
This allows developers to test the application with mocked data and simulate different scenarios without relying on external APIs or services.
Note that the Service Worker is only active in development mode.

## Testing

Run units tests:

```shell
yarn test
```
