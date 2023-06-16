#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { APIStack } from "../lib/api-stack";
import { DeployStack } from "../lib/deploy-stack";
import { VPCStack } from "../lib/vpc-stack";

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

const { vpc } = new VPCStack(stage, "VPCStack", {
  stackName: "VPCStack",
});

const deploy = new DeployStack(stage, "DeployStack", {
  stackName: "DeployStack",
});

const api = new APIStack(stage, "APIStack", vpc, {
  stackName: "ApiStack",
});

//api.addDependency(deploy, "share cloudfront distribution");
