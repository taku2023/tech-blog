import { Stack, StackProps } from "aws-cdk-lib";
import {
  Cors,
  EndpointType,
  LambdaRestApi,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { IVpc } from "aws-cdk-lib/aws-ec2";
//import { GoFunction } from "aws-cdk-lib/aws-lambda";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { DatabaseProxy } from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";
import { BastionHost } from "./resources/bastion-host";
import { LambdaAPIProxy } from "./resources/lambda-api-proxy";
import { RDSWithProxy } from "./resources/rds-proxy";

interface ShareResourceProps {
  vpc: IVpc;
}

export class APIStack extends Stack {
  public readonly restApi: RestApi;
  public readonly proxy: DatabaseProxy;

  constructor(
    scope: Construct,
    id: string,
    { vpc }: ShareResourceProps,
    props?: StackProps
  ) {
    super(scope, id, props);

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

    this.proxy = proxy;

    const readWriteRDSPolicy = new PolicyStatement({
      actions: ["rds-db:connect"],
      resources: [proxy.dbProxyArn],
    });

    //bastion host access rds
    new BastionHost(this, "BastionHost", vpc);
    const { lambda: apiProxyHandler } = new LambdaAPIProxy(
      this,
      "APIProxy",
      vpc
    );

    this.restApi = new LambdaRestApi(this, "Blog-RestApi", {
      restApiName: "Blog-RestApi",
      proxy: true,
      endpointConfiguration: {
        types: [EndpointType.EDGE],
      },
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
      },
      handler: apiProxyHandler,
      deploy: true,
    });

    //set proxy endpoint env for lambda connection
    proxy.grantConnect(apiProxyHandler);
    apiProxyHandler.addToRolePolicy(readWriteRDSPolicy);
    /**
     * Read SSM
     */
    const readSSMPolicy = new PolicyStatement({
      actions: ["secretsmanager:GetSecretValue"],
      resources: [dbSecret.secretArn],
    });
    apiProxyHandler.addToRolePolicy(readSSMPolicy);
    apiProxyHandler.addEnvironment("endpoint", proxy.endpoint);
    apiProxyHandler.addEnvironment("secret", dbSecret.secretName);
    apiProxyHandler.addEnvironment("username", "admin");
    apiProxyHandler.addEnvironment("dbname", databaseName);
  }

}
