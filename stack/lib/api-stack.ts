import { RemovalPolicy, ScopedAws, Stack, StackProps } from "aws-cdk-lib";
import { Cors, EndpointType, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  InterfaceVpcEndpointAwsService,
  IpAddresses,
  Peer,
  Port,
  SecurityGroup,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
//import { GoFunction } from "aws-cdk-lib/aws-lambda";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  DatabaseSecret,
  MysqlEngineVersion,
} from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";
import * as path from "path";
//import { DatabaseInstance,DatabaseInstanceEngine } from "aws-cdk-lib/aws_rds";

export class APIStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const { accountId, region } = new ScopedAws(this);

    /*const distributionId = Fn.importValue("CloudFrontID");
    const domainName = Fn.importValue("CloudFrontDomain");
    const cloudfront = Disimport { RestA } from 'aws-cdk-lib/aws-apigatewayv2';
tribution.fromDistributionAttributes(this, "CloudFrontDist", {
      distributionId,
      domainName,
    });*/

    //vpc
    const vpc = new Vpc(this, "WebApi-VPC", {
      maxAzs: 2,
      ipAddresses: IpAddresses.cidr("10.0.0.0/22"),
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "private-subnet-gp",
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    const interfaceEndpoint_SG = new SecurityGroup(
      this,
      "InterfaceEndpoint_SG",
      {
        securityGroupName: "InterfaceEndpoint_SG",
        vpc,
      }
    );

    const apiGateWayEndpoint = vpc.addInterfaceEndpoint("APIGatewayEndpoint", {
      service: InterfaceVpcEndpointAwsService.APIGATEWAY,
      subnets: {
        subnetGroupName: "private-subnet-gp",
      },
      securityGroups: [interfaceEndpoint_SG],
      //privateDnsEnabled: true,
    });

    const secretManagerEndpoint = vpc.addInterfaceEndpoint(
      "SecretManagerEndpoint",
      {
        service: InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
        subnets: {
          subnetGroupName: "private-subnet-gp",
        },
        //securityGroups: [],
      }
    );

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
    const dbSecret = new DatabaseSecret(this, "rds-secret", {
      secretName: "rds-secret",
      username: "admin",
    });

    const databaseName = "blog_dev";

    const dbInstance = new DatabaseInstance(this, "rds", {
      engine: DatabaseInstanceEngine.mysql({
        version: MysqlEngineVersion.VER_8_0_28,
      }),
      credentials: Credentials.fromSecret(dbSecret),
      vpc,
      databaseName,
      vpcSubnets: {
        subnetGroupName: "private-subnet-gp",
      },
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const proxySG = new SecurityGroup(this, "RDSProxySG", { vpc });
    proxySG.addIngressRule(Peer.anyIpv4(), Port.tcp(3306));
    const rdsProxy = dbInstance.addProxy("PrivateRDSProxy", {
      vpc,
      requireTLS: false, //TODO: true when prod
      vpcSubnets: {
        subnetGroupName: "private-subnet-gp",
      },
      secrets: [dbSecret],
      securityGroups: [proxySG],
      debugLogging: true,
    });

    const readWriteRDSPolicy = new PolicyStatement({
      actions: ["rds-db:connect"],
      resources: [rdsProxy.dbProxyArn],
    });

    //set proxy endpoint env for lambda connection
    rdsProxy.grantConnect(lambdaFunction);
    lambdaFunction.addToRolePolicy(readWriteRDSPolicy);
    /**
     * Read SSM
     */
    const readSSMPolicy = new PolicyStatement({
      actions: ["secretsmanager:GetSecretValue"],
      resources: [dbSecret.secretArn],
    });
    lambdaFunction.addToRolePolicy(readSSMPolicy);
    lambdaFunction.addEnvironment("endpoint", rdsProxy.endpoint);
    lambdaFunction.addEnvironment("secret", dbSecret.secretName);
    lambdaFunction.addEnvironment("username", "admin");
    lambdaFunction.addEnvironment("dbname", databaseName);
  }
}

//takuaki-blog-content
