<!--- This file is automatically generated. Dont edit! -->
# SEACRIFOG
This is a tool for exploring the inventory of carbon-related observation infrastructure. There are numerous metadata repositories describing, and linking to, datasets related to carbon measurement in some way or another. These datasets are rich, but not easily discovered by existing search tools such as Google Search. 

The prototype (currently available at https://seacrifog.saeon.ac.za) is aimed at providing an interactive overview of the infrastructure that supports carbon measurements. Users can select/deselect various elements of the carbon observation infrastructure, which serves the dual purpose of providing detailed information on individual, selected components of the system, and also constraining search criteria that can be applied against various organizations’ metadata repositories across the world (providing these organizations make their repositories electronically searchable, which many do).

The prototype consists of a pair of software applications:

- A long running HTTP server that provides a publicly available API for interacting with the data representing the carbon observation platform model, and that acts as an adapter for specifying metadata-searches constrained by some selection of the platform entities
- A browser client (website) that provides a richly interactive UI for interacting with the API. 

The browser client is tightly coupled with the API logic. The API, however, can stand as a useful publicly available service in it’s own right.

# Tech stack
- Database
  - PostGIS
- API
  - Node.js (server-side JavaScript framework)
  - Express (web application framework)
  - GraphQL (express-graphql)
  - Node Postgres (database adapter)
- Browser client
  - ESNext (Babel, Webpack precompilation and bundling)
  - React
  - Apollo Client (GraphQL provider)
  - React-MD (MIT licensed Material Design component library implementation)

# Data model
![alt text](images/data-model.png "Simplified ERD diagram showing the entities used in the search logic")

# API
The API provides HTTP endpoints, and a GraphQL interface. For the most part the HTTP endpoints are just stubs - they don't provide any real value at this point but as a proof of concept that a GraphQL and RESTful API can share the data access layer completely (so it's fairly straightforward to provide both).

<!-- - [API documentation](http://api.seacrifog.saeon.ac.za "API Documentation") -->
- [Interactive API Explorer](https://api.seacrifog.saeon.ac.za/graphiql "GraphiQL")
- [GraphQL endpoint](http://api.seacrifog.saeon.ac.za/graphql "API Endpoint")
- [HTTP endpoint](http://api.seacrifog.saeon.ac.za/http) - [/http/variables](http://api.seacrifog.saeon.ac.za/http/variables) & [/http/variables/:id](http://api.seacrifog.saeon.ac.za/http/variables/1)

#### [Integrations](api/src/resolvers/queries/search-metadata/)
Integrations need to be specified by a user in two places. These are:

1. Logic for polling network/site information from an endpoint - this is currently in the form of a JavaScript function that is executed on a scheduled interval. An example of the integration with ICOS is [included in the source code](api/src/cron/_icos-integration.js). Currently the source code of the API needs to be adjusted to include further integrations - but this is a straightforward change to make in the future.
2. Search logic needs to be specified per organization as a JavaScript function - [executors](api/src/resolvers/queries/search-metadata/executors). An example of the function contract is included in the source code. These functions are executed as child processes to the main Node.js process. Currently only JavaScript executors are supported, but it would be fairly straightforward to allow for interoperability between the API and executors in a variety of programming languages. To add a new executor, add an appropriate function to the source code and then redeploy the application.

#### [Data access layer](api/src/db/)
Data access is directly via SQL using the [Node Postgres](https://node-postgres.com/) PostgreSQL client, with a [thin wrapper](api/src/db/_query.js) over the query functionality to handle connection pooling (hopefully) correctly. GraphQL APIs require request level batching optimization even from the very beginning - due to the logic of how GraphQL queries are resolved - this is implemented as is typically done via the [DataLoader](https://github.com/graphql/dataloader) library. All future work on the data access layer needs to implement database queries via this pattern - there are many references WRT to how to use DataLoader in the context of this project.

# Client
The client currently deployed at [seacrifog.saeon.ac.za](http://seacrifog.saeon.ac.za/graphql "SEACRIFOG Work package 5.4 deliverable deployment on SAEON's infrastructure") as an SPA (Single Page Application), such is typical of React.js client apps. Architecturally, the client is organized conceptually of 'pages', each page comprising one or more 'modules'. Observational infrastructure is organized according to entity 'class'. For each entity class there is a page that lists all entities of that type (a list/explorer page), and an overview page that allows for seeing and editing a single entity. For example, all the entities of type `Variable` can be found on the HTTP path `/variables`, listed and searcheable in a table. A single variable can be viewed and edited on the `/variable/:id` path. There is an exception - the `/sites` route displays a map of sites, along with proof-of-concept visualization charts. Individual sites can be edited on the `/networks/:id` path (sites of a particular network can be edited). Below is a representation of the site map:

```
.
├── /sites
├── /networks
│   └── /networks/:id
├── /variables
│   └── /variables/:id
├── /protocols
│   └── /protocols/:id
└── /search-results
```

## Modules
The concept of **modules** WRT the client refers to reuseable react components. There is no definite difference between a **component** and a **module** in the context of SEACRIFOG. Essentially at some point a component is considered large enough to be a module, or sometimes modules export a number of related components. These are defined in [client/src/modules](client/src/modules).

#### [Atlas](client/src/modules/atlas)
The map is provided by OpenLayers 6, utilizing an API provided by a thin React.js wrapper library - [@saeon/ol-react](https://www.npmjs.com/package/@saeon/ol-react "React OL Wrapper library") - authored by SAEON (at the time of writing there are no well-maintained OpenLayers 6 React.js wrapping libraries) and made available as MIT-licensed open source code. OpenLayers in the context of a JavaScript application is just a single object `olMap`. This object keeps it's own internal state and handles interactions internally. The `@saeon/ol-react` wrapper layer essentially provides the means of mapping React state to `olMap` internal state. This is achieved via using the [ECMAScript Proxy objects API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Note that this is incompatible with Internet Explorer, and not possible to polyfill. This tool as it currently exists should, however, work on Internet Explorer 11 and upwwards only because no advanced layer management is used. This will obviously not be the case with further development. In addition to the layer proxy, the Atlas module provides a means of selecting/deselecting map features, and also for specifying layers.

Throughout the client the `@saeon/ol-react` component is used directly. The `Atlas` module consists of map-related exports that are reused wherever maps are shown (these maps use the same layers, styles, configurable sources, etc.).

#### [DataMutation](client/src/modules/data-mutation/index.js)
A simple component that wraps Apollo Client's `useMutation` hook.

#### [DataQuery](client/src/modules/data-query/index.js)
A simple component that wraps Apollo Client's `useQuery` hook.

#### [EditorPage](client/src/modules/editor-page/)
A collection of components that are the basis of the 'editor' pages (`/networks/:id`, `/variables/:id`, and `/protocols/:id`). The components include headers, input field formatters, etc.

Typically web forms are binded to some model - often referred to as 'form model binding'. This conceptually allows for representation of some table/object state as an appropriate input field. Similarly, this concept is utilized in SEACRIFOG. All the edit pages make use of UI logic to draw editble forms from JavaScript object (and provide a means of saving them to the database via GraphQL mutations).

#### [ExplorerPage](client/src/modules/explorer-page/)
A collection of components that are the basis of the list/explorer pages (`/networks`, `/variables`, and `/protocols`). The components include headers, buttons, user-feedback messages, etc.

#### [Layout](client/src/modules/layout/)
A collection of components that are used to draw the SPA. These include a `<Footer />` component that is used on most pages as well as navigation-related components that are typically only used once as 'parents' to other components used throughout the application. HTML path-based routing is handled by the `react-router` library.

#### [Global state managment & Search module](client/src/modules/shared-components/_global-state.jsx)
State is managed in three ways across the application:

- Locally: state that is localized to individual components is achieved via stateful component ([class components](https://reactjs.org/docs/state-and-lifecycle.html)) or by using the newer [React Hooks API](https://reactjs.org/docs/hooks-state.html)
- Explicity: Stateful contexts are typically provided across groups of components via well-known React architectural patterns including [explicitly passing props down component trees](https://reactjs.org/docs/composition-vs-inheritance.html), or the [render props pattern](https://reactjs.org/docs/render-props.html)
- Globally via the [context API](https://reactjs.org/docs/context.html)

A single global state module is used to keep track of user interactions across the app (selecting/deselecting of items). As entities are toggled a background search is performed for all currently selected search critera - the results are stored in client memory.

#### [SharedComponents](client/src/modules/shared-components/)
For the most part, components are used directly as provided by the React-MD library - already a significant amount of work in terms of crafting reuseable components! However there are a few cases in this UI that 'grouped element trees' are reused in multiple places throughout the application. These include:

- User-feedback messages (kept in a single place for consistency)
- A controlled table that supportes searching, sorting, and selecting rows (controlled meaning that state is handled by a parent component, so that seleting rows can update the global state)
- A filterable list of items that can be selected/deselcted - also controlled
- The Side filter component used throughout the application. This component combines many instances of the `DropdownSelect` componet, along with controlling callbacks to update the global state module. This component is used on most pages - it provides direct access to the the current global state in terms of what is being filtered
- ChartStateManagement - Interactive charts are shown as a proof of concept. The API currently  requires that management of state is done via context
- A form component - simple to place anywhere in the component tree, and provides localized state management for all elements in the sub tree.

## Pages
The concept of **pages** WRT the client refers to what is displayed at any particular URI. Pages comprise **modules**. These are defined in [client/src/pages](client/src/pages).

#### [/home](client/src/pages/home/) [/](client/src/pages/home/)
Static information mostly - partner logos are shown on this page.

#### [/sites](client/src/pages/explorer-sites/)
The map is interactive in that it allows for assessing which variables are measured at which sites (or groups of sites) - this is achieved by clicking features on the atlas, that will both add selected sites to the metadata filter, and trigger charts (provided by `eCharts`) to display.

#### [/networks](client/src/pages/explorer-networks/) [/variables](client/src/pages/explorer-variables/) [/protocols](client/src/pages/explorer-protocols/)
These routes display the list/explorer pages. Mostly the pages make use of the reuseable components that comprise the **ExplorerPage** module.

#### [/networks/:id](client/src/pages/editor-networks/) [/variables/:id](client/src/pages/editor-variables/) [/protocols/:id](client/src/pages/editor-protocols/)
These routes display editor pages for the various entities, utilizing reuseable components that form the **EditorPage** module.

#### [/search-results](client/src/pages/search-results/)
The search results page comprises a tabed layout with the content of the tab a list of search results. This is easy to see via a visual representation of the element tree that is rendered on this page:

```
.
├── Toolbar header
└── Tab container
    ├── Tab content (org 1)
    │   └── Virtualized list (handles many records)
    │       ├── RecordViewer
    │       │   └── OrgRenderer
    │       ├── RecordViewer
    │       │   └── OrgRenderer
    │       └── (many more records) ...
    ├── Tab content (org 2)
    │   └── Virtualized list
    │       ├── RecordViewer
    │       │   └── OrgRenderer
    │       ├── RecordViewer
    │       │   └── OrgRenderer
    │       └── (many more records) ...
    └── ...
```

The **OrgRenderer** object is passed as properties to the **RecordViewer** component. A list of OrgRenderer objects is provided as [configuration](client/src/pages/search-results/configuration.js) to the item renderer (`<RecordViewer org={OrgRenderedObj} />`). Loosely speaking this pattern is refferred to as **dependency injection**.

Renderer objects comprise a variety of callbacks that are passed individual records. These callbacks need to be user-defined to return the correct information per field. The configuration file shows all the organizations that have been integrated into SEACRIFOG. Further work on SEACRIFOG could involve providing a means of editing the configuration object from a web UI - this would allow organizations to 'register' how their metadata records should be displayed. (Note that a similar registration process would need to be implemented on the API so that users could also define how any organization could be searched).

# Current deployment (as of February 2020)
- PostGIS: Served via a Docker container (mdillon/postgis Docker image)
- API: Docker container (refer to the Dockerfile in the source code)
- Browser client: Docker container (refer to the Dockerfile in the source code)
- Server: Single CentOS 7 virtual machine (2 cores, 2GB RAM, 60GB)

# DEVELOPER DOCUMENTATION
This repository contains two separate applications - a client and and API. Dependencies are NOT shared between these projects. Setup the project after cloning this repository via the following steps:

#### Install project wide dependencies
```sh
npm install
```

#### Install dependencies for the client and API (this is also mentioned below)
```sh
npm --prefix api/ install
npm --prefix client/ install
```


# API DEVELOPER DOCUMENTATION
API usage documentation is coming soon! Below are instructions on how how to contribute and deploy this software.

## Quickstart the API (local dev environment)
**Start a PostGIS server**
```sh
docker run -p 5432:5432 --name postgis -v postgres11:/var/lib/postgresql/data -e POSTGRES_PASSWORD=password -d mdillon/postgis
```

**Setup the DB**
The .backup file is from an older version of PostgreSQL and some PostgreSQL clients don't read it as a result. Dbeaver - a decent, free DB IDE - has a PostgreSQL client that works by default, but any PostgreSQL client should work).

1. Log into a running PostGIS server
2. Create a DB called `seacrifog_old`
3. Restore ([seacrifog-prototype.backup](api/src/db)) to this database. It's located in this repository at `api/src/db/`

Once the `seacrifog_old` backup is restored, on application startup a new database will be initialized (`seacrifog`). The old data will be migrated to a new schema and the CSVs located in `api/src/db/csvs` will be imported as well. These are dummy data that are the result of work outputs prior to Workpackage 5.4.

**Install Node.js dependencies**
```sh
npm --prefix api/ install
```

**Configure the API to re-create the database on startup**
This is false by default (for obvious reasons!)
```sh
echo FORCE_DB_RESET=true > api/.env
```

**Start the API**
```sh
npm --prefix api/ start
```
The application should be listening for connections on `http://localhost:3000`. 

## Deploying API to production
1. Configure a Postgis database server somewhere
2. The application reads a `.env` file located at `api/.env` on startup. So to configure the API, as part of the deployment process create such a file and populate it with production-sensible values (refer to notes below on "API configuration")
3. Start the app: `npm --prefix api/ run start:prod`

## API configuration
This is a sample of the environment variables that the app requires to run - specifically in the context of a `.env` file (with the default values shown).
```
# Example .env file with defaults
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_DATABASE=seacrifog
POSTGRES_PASSWORD=password
POSTGRES_PORT=5432
FORCE_DB_RESET=false
INITIAL_CRON_WAIT=1000
ICOS_INTEGRATION_SCHEDULE=*/10 * * * *
```

#### PORT
The port on which the application listens for HTTP requests

#### ALLOWED_ORIGINS
Clients (that support CORS restrictions) from these addresses will be allowed to access the API resources

#### POSTGRES_*
PostgreSQL connection configuration parameters

#### FORCE_DB_RESET
When true, the database will be deleted and recreated on API startup

#### INITIAL_CRON_WAIT
It can take a number of seconds for the API to settle on startup (for example if the database is being created). The CRON scheduler will only start jobs after this delay

#### ICOS_INTEGRATION_SCHEDULE
Intervals between runs of the ICOS integration logic (this is to get station information from the ICOS database)

# CLIENT DEVELOPER DOCUMENTATION

## Quickstart the client (local dev environment)
First setup the API, then

#### Install client dependencies
```sh
npm --prefix client/ install
```

#### Start the client developer server
```sh
npm --prefix client/ start
```

#### Some helpful Notes
1. Testing this on Windows (using `npm` via Powershell), I had to install `npm-run-all` globally. `npm install npm-run-all -g`
2. Running `npm install`, some of the packages will install platform specific bindings. So if something isn't working try removing the `node_modules` directory and re-running `npm install`

## Deploying Client to production
1. The application reads a `.env` located at `client/.env` during the Webpack build process. So to configure the client, as part of the deployment process (and prior to the build step) create such a file and populate it with production-sensible values (refer to notes below on "Client configuration")
2. Generate the build: `npm --prefix client/ run dist`
3. This will create a folder `client/dist` containing the client resources, with a typical `index.html` entry point. Serve via preferred HTTP server (Apache, Nginx, Node.js, etc.)

#### Some helpful Notes
The Dockerfile at `client/Dockerfile` encapsulates the above steps and should be useable in any deployment environment as is. Use the Dockerfile via the following commands:

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
```

