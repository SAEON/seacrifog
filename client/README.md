# CLIENT DEVELOPER DOCUMENTATION

## Quick start the client (local dev environment)
Once the API is setup, configure the client. This needs to be don in the context of the client package, meaning all the commands need to be run from the root of the client. Starting in the root of the seacrifog repository. The following commands should be executed to setup the environment:

1. `cd client`
2. `npm install`
3. `npm start`

Create a file .env, with the following contents:

```txt
GQL_ENDPOINT=http://localhost:3000/graphql
DOWNLOADS_ENDPOINT=http://localhost:3000/downloads
```

**Some helpful Notes**

1. Testing this on Windows (using `npm` via Powershell), I had to install `npm-run-all` globally. `npm install npm-run-all -g`
2. Running `npm install`, some of the packages will install platform specific bindings. So if something isn't working try removing the `node_modules` directory and re-running `npm install`

## Deploying Client to production
1. The application reads a `.env` located at `client/.env` during the Webpack build process. So to configure the client, as part of the deployment process (and prior to the build step) create such a file and populate it with production-sensible values (refer to notes below on "Client configuration")
2. Generate the build: `npm run dist` (from the root of the client package)
3. This will create a folder `client/dist` containing the client resources, with a typical `index.html` entry point. Serve via preferred HTTP server (Apache, Nginx, Node.js, etc.)

**Some helpful Notes**

The Dockerfile at `client/Dockerfile` encapsulates the above steps and should be usable in any deployment environment as is. Use the Dockerfile via the following commands:

```sh
# Change context to the client directory
cd client/

# Create an image
docker build -t seacrifog-client .

# Run a container, exposing relevant ports
docker run -p 80:80 seacrifog-client
```

## Configuration
Configuration is looked for on Node's `process.env` environment configuration during build. Client configuration specifies, at build time, the address that the client looks for the API on.

```
# Example .env file with defaults
HTTP_ENDPOINT=https://api.seacrifog.saeon.ac.za/http
GQL_ENDPOINT=https://api.seacrifog.saeon.ac.za/graphql
DOWNLOADS_ENDPOINT=https://api.seacrifog.saeon.ac.za/downloads
DEFAULT_SELECTED_SITES=
DEFAULT_SELECTED_NETWORKS=
DEFAULT_SELECTED_VARIABLES=
DEFAULT_SELECTED_PROTOCOLS=
```

The `DEFAULT_SELECTED_*` configuration options are helpful for development, as it allows to test the application in various search states on app start. Specify a default selection via a comma separated list of IDs - `DEFAULT_SELECTED_SITES=1,2,3,4,etc`. IDs are obviously relative to your local database, and this setting should **not** be pushed to the master branch (and therefore production).