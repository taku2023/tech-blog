#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ResourceStack } from "../lib/resource-stack";
import { VPCStack } from "../lib/vpc-stack";

const app = new cdk.App();

const mode = app.node.getContext("mode");
const stage = new cdk.Stage(app, mode, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const vpcStack = new VPCStack(stage, "VPCStack", {
  stackName: "VPCStack",
});

const apiStack = new ResourceStack(
  stage,
  "ResStack",
  { vpc: vpcStack.vpc },
  {
    stackName: "ResourceStack",
  }
);
