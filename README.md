<img align="right" alt="Deskpro Logo" src="./docs/assets/deskpro-logo.svg" />

# Smartsheet App
Manage your Smartsheet tasks directly in Deskpro for a seamless workflow integration.

![Screenshot of the Smartsheet App](./docs/assets/smartsheet-app-screenshot.jpg)

## **Usage**
We recommend using [PNPM](https://pnpm.io/) to manage this project. First, start by installing the project 
dependencies.

```bash
pnpm install
```

Then, run the development server.

```bash
pnpm run start
```

You should now be able to view the app in your browser.

## **Testing**
---

We've included `jest` to run your tests. It will look anywhere in `/src` for test suite files ending in `.test.tsx` or `.test.ts`.

You can run all tests using:

```bash
pnpm run test
```

## **Pull Requests**
Every app deployment requires that the version property in the `manifest.json` file be updated to reflect the new app version. This is so Deskpro can detect changes and add/upgrade apps accordingly. As such, we've made altering versions easy by having CI make the actual version change for you. Here's what we do:

* We increment patch versions, i.e. 1.0.1, automatically. You don't need to do anything and this will happen
* Minor versions, i.e. 1.1.0, are incremented if you add the minor-version GitHub label to your PR
* Major versions, i.e. 2.0.0, are incremented if you add the major-version GitHub label to your PR

## **Additional Resources**

Get the most out of the integration with these resources:

- **[Smartsheet App Setup Instructions](./SETUP.md)** - A step-by-step guide to setting up the Smartsheet app in Deskpro.
- **[Smartsheet API Documentation](https://smartsheet.redoc.ly/)** - A comprehensive guide to Smartsheet’s API and capabilities.
- **[Deskpro Apps Documentation](https://support.deskpro.com/ga/guides/developers/anatomy-of-an-app)** - A guide to building Deskpro Apps.
