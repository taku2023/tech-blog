#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { APIStack } from "../lib/api-stack";
import { VPCStack } from "../lib/vpc-stack";
import { WebStack } from "../lib/web-stack";

const app = new cdk.App({
  autoSynth: true,
});

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

const apiStack = new APIStack(
  stage,
  "APIStack",
  { vpc: vpcStack.vpc },
  {
    stackName: "ApiStack",
  }
);

const webStack = new WebStack(
  stage,
  "WebStack",
  {
    vpc: vpcStack.vpc,
    restApi: apiStack.restApi,
    proxy: apiStack.proxy,
  },
  {
    stackName: "WebStack",
  }
);
/*
apiStack.addDependency(vpcStack);
webStack.addDependency(apiStack);
*/