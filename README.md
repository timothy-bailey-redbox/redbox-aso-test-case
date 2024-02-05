# Redbox ASO Dashboards

This is the frontend UI as backend functions that power the Redbox ASO Dashboard system.

The system draws data from 2 external databases provided by Fivetran and Apptweak.

## Technology

This project is built using:

-   Next.js
-   Typescript
-   React-Query
-   Netlify functions
-   Postgresql
-   Zustand
-   Netlify Identity

## Deployment

Deployment is provided by Netlify, which handles our user authentication needs as well as providing a Lambda environment for running backend functionality.

The `main` branch is attached directly to production deployment and all PRs that merge into this branch will trigger a deployment.

## Local development

### Frontend only

To run this project locally there are no required environment variables, but you will be unable to make use of any functionality that requires login or requested data.

Start only the Next.JS application using the command: `npm run dev`.

### Frontend and backend

To fully run this project on your machine you must first make a copy of the `.env.example` file to `.env` and fill in all of the environment variables. `.env` is ignored from git to prevent committing secrets.

Start up the application using the command: `npm run dev:backend`. The Next.js app will start up in development mode as well as a server that is providing a Lambda environment for the backend functions to execute.

## Project structure

There are several main folders in the root of the project.

### Src

The `src` folder contains all of the code for the Next.js Frontend application. All files placed in the `src/pages` folder are deployed as the application url paths.

### Netlify

The `netlify` folder contains all of the code used by the backend Lambda functions. All files placed inside of `netlify/functions` are registered as the API endpoints.

### Types

The `types` folder contains all of the typescript types that are used by the API. They have been separated into a root folder as they are imported by both the Netlify functions and the Next.js application.

### Public

The files in the `public` folder will be statically hosted when deployed.

### Scripts

The `scripts` folder contains any scripts used during deployment as well as any database migration scripts. These are mostly run from the package, but can also be invoked used the `tsx` runner: e.g. `npx tsx scripts/scriptName.ts`
