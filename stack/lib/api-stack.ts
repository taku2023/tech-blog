import { Stack, StackProps } from "aws-cdk-lib";
import { Cors, EndpointType, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IVpc } from "aws-cdk-lib/aws-ec2";
//import { GoFunction } from "aws-cdk-lib/aws-lambda";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";
import { BastionHost } from "./resources/bastion-host";
import { RDSWithProxy } from "./resources/rds-proxy";
//import { DatabaseInstance,DatabaseInstanceEngine } from "aws-cdk-lib/aws_rds";

//interface

export class APIStack extends Stack {
  constructor(scope: Construct, id: string, vpc: IVpc, props?: StackProps) {
    super(scope, id, props);

    //bastion host access rds
    new BastionHost(this, "BastionHost", { vpc });

    const lambdaFunction = new Function(this, "handler", {
      runtime: Runtime.GO_1_X,
      code: Code.fromAsset(path.join(__dirname, "../../lambda/api"), {
        bundling: {
          image: Runtime.GO_1_X.bundlingImage,
          environment: {
            CGO_ENABLED: "0",
            GOOS: "linux",
            GOARCH: "amd64",
          },
          user: "root",
          command: [
            "bash",
            "-c",
            ["make vendor", "make lambda-build"].join(" && "),
          ],
        },
      }),
      handler: "main",
      vpc,
      vpcSubnets: {
        subnetGroupName: "private-subnet-gp",
      },
    });

    /*lambdaFunction.addToRolePolicy(new PolicyStatement({
      principals:[ ServicePrincipal]
    }))*/

    const restApi = new LambdaRestApi(this, "Blog-RestApi", {
      restApiName: "Blog-RestApi",
      proxy: true,
      endpointConfiguration: {
        types: [EndpointType.EDGE],
      },
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
      },
      handler: lambdaFunction,
      deploy: true,
    });

    /**
     * RDS
     */
    const { proxy, dbSecret, databaseName } = new RDSWithProxy(
      this,
      "RDSWithProxy",
      {
        vpc,
        subnets: vpc.selectSubnets({
          subnetGroupName: "private-subnet-gp",
        }),
      }
    );

    const readWriteRDSPolicy = new PolicyStatement({
      actions: ["rds-db:connect"],
      resources: [proxy.dbProxyArn],
    });

    //set proxy endpoint env for lambda connection
    proxy.grantConnect(lambdaFunction);
    lambdaFunction.addToRolePolicy(readWriteRDSPolicy);
    /**
     * Read SSM
     */
    const readSSMPolicy = new PolicyStatement({
      actions: ["secretsmanager:GetSecretValue"],
      resources: [dbSecret.secretArn],
    });
    lambdaFunction.addToRolePolicy(readSSMPolicy);
    lambdaFunction.addEnvironment("endpoint", proxy.endpoint);
    lambdaFunction.addEnvironment("secret", dbSecret.secretName);
    lambdaFunction.addEnvironment("username", "admin");
    lambdaFunction.addEnvironment("dbname", databaseName);
  }
}

//takuaki-blog-content
