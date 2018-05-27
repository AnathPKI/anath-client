[![Build Status](https://travis-ci.org/AnathPKI/anath-client.svg?branch=master)](https://travis-ci.org/AnathPKI/anath-client)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=anath-client&metric=alert_status)](https://sonarcloud.io/dashboard?id=anath-client)
[![Latest Release](https://github-basic-badges.herokuapp.com/release/AnathPKI/anath-client.svg)](https://github.com/AnathPKI/anath-client/releases/latest)

# Bsc Thesis Reference Implementation

Anath is the Bsc Thesis reference implementation of a self-service PKI.

Anath features:

* Import of Root CA
* Creation of self-signed CA certificate
* User management
* Configuration templates
* Certificate creation and revocation

## Images

The whole webclient can be found on the [GitHub Releases](https://github.com/AnathPKI/anath-server/releases) page.
Alternatively, the [Demo repository](https://github.com/AnathPKI/demo) provides Docker Compose files to run Docker Images.

## Requirements

* Node v0.1.0
* npm

## Build Docker Image

When docker, node and npm are installed, a docker image can be built locally:

```bash
npm install
docker build -t anathpki/client:test .
```

## Start client

You can start the client local with the following steps:

1. Checkout resources
2. Run `npm start`
3. Access the client on `http://localhost:8000`

**Important:**
Set the "BACKEND_URL" to the correct value in app/app.js

Hint:
You can copy the app folder to the root directory of an other Webserver to make the client available.
