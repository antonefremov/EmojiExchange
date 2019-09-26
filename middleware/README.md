# Based on ["Basic Implementation of Typescript with Node.js and Express.js"](https://github.com/andregardi/ts-express)

## Goal
Create a service template based on TS, which is deployable to the SAP CP CF Environment.

## Prerequisites
- You [signed up](https://account.hanatrial.ondemand.com/register) for a [trial account](https://account.hanatrial.ondemand.com/) in SAP Cloud Platform, or you have a productive account.
- Once you got your account, you performed the steps described in [Getting Started with Cloud Foundry](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/b8ee7894fe0b4df5b78f61dd1ac178ee.html).
- You have basic knowledge about [Node.js: Development](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/3a7a0bece0d044eca59495965d8a0237.html), for example, [Create a Node.js Application](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/772b45ce6c46492b908d4c985add932a.html) and [SAP NPM Registry](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/fe672690385a4541b45622a9088f4503.html). Please make sure that you bookmark these pages: Later [SAP Node.js Packages](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/92f1bce8f72946c180d198e21f74a68c.html) and [Secure Node.js Applications](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/3a8e4372f8e74d05b4ed03a484865e08.html) are also relevant.
- For more information about working with NPM registry, see this [blog](https://blogs.sap.com/2017/05/16/sap-npm-registry-launched-making-the-lives-of-node.js-developers-easier/).


## Step 1: Configure NPM on your machine to ensure all subsequent NPM calls work.
Execute the following command:
```
npm config set @sap:registry https://npm.sap.com
```

## Step 2: Run the service locally.
- Clone this repo to your machine.
- In the folder you cloned into, execute the `npm install` command.
- To start the server, execute the `nodejs server.js` command.

## Step 3: Push to Cloud and run the service.
To log on, access your endpoint with the following command:
```
cf api https://api.cf.eu10.hana.ondemand.com
```
or: 
```
cf api https://api.cf.us10.hana.ondemand.com
```
(depending upon the landscape your account was created in)  
To log on use the following command:
```
cf login
```
If you have access to more than 1 org or space, execute the following command:
```
cf target -o ORG -s SPACE
```
To deploy the application to SAP Cloud Platform Cloud Foundry Environment, execute the following command:
```
cf push --random-route
```
For more information on these commands, see [Getting Started with Cloud Foundry](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/b8ee7894fe0b4df5b78f61dd1ac178ee.html) and [Deploy an Application](http://docs.cloudfoundry.org/devguide/deploy-apps/deploy-app.html).


Check the output of this command, and write down the URL created for the application.  
As a result you should be able to browse `https://<URL for your app>/users`.  
If you want to use the `Postman` collection above, please adjust the URL for the requests in the Cloud folder to the allocated `<URL for your app>`.


