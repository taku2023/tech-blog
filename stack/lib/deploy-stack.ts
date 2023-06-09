import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

export class DeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //github-role
    const role = new Role(this, "github-deploy", {
      roleName: "github-deploy-role",
      assumedBy: new ServicePrincipal(""),
    });
  }
}
