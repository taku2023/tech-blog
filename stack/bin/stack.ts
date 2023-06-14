#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { APIStack } from "../lib/api-stack";
import { DeployStack } from "../lib/deploy-stack";

const app = new cdk.App();
const deploy = new DeployStack(app, "DeployStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  stackName: "DeployStack",
});

const api = new APIStack(app, "APIStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  stackName: "ApiStack",
});

//api.addDependency(deploy, "share cloudfront distribution");
