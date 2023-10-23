#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ResourceStack } from "../lib/resource-stack";

const app = new cdk.App();

const mode = app.node.getContext("mode");
const stage = new cdk.Stage(app, mode, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

new ResourceStack(
  stage,
  "ResStack",
  {
    stackName: "ResourceStack",
  }
);
