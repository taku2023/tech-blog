import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { EndpointType, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IVpc, SubnetType } from "aws-cdk-lib/aws-ec2";
//import { GoFunction } from "aws-cdk-lib/aws-lambda";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { appContext } from "../bin/config";
import { BastionHost } from "./resources/bastion-host";
import { LambdaExtractProcess } from "./resources/extract-blog";
import { LambdaAPIProxy } from "./resources/lambda-api-proxy";
import { RDSWithProxy } from "./resources/rds-proxy";
import { NotifyBlogBucket } from "./resources/s3-blog";
import { WebFront } from "./resources/webfront";

interface ShareResourceProps {
  vpc: IVpc;
}

export class ResourceStack extends Stack {
  //public readonly restApi: RestApi;
  //public readonly proxy: DatabaseProxy;
  //public readonly lambda: Function;

  constructor(
    scope: Construct,
    id: string,
    { vpc }: ShareResourceProps,
    props?: StackProps
  ) {
    super(scope, id, props);
    const { domainName, ssm,gateway } = appContext(this);

    /**
     * RDS
     */
    const { proxy, dbSecret, databaseName ,proxySG} = new RDSWithProxy(
      this,
      "RDSWithProxy",
      {
        vpc,
        subnets: vpc.selectSubnets({
          subnetType: SubnetType.PRIVATE_ISOLATED,
        }),
      }
    );

    /**
     * ReadWrite RDS policy
     */
    const readWriteRDSPolicy = new PolicyStatement({
      actions: ["rds-db:connect"],
      resources: [proxy.dbProxyArn],
    });
    /**
     * Read SSM
     */
    const readSSMPolicy = new PolicyStatement({
      actions: ["secretsmanager:GetSecretValue"],
      resources: [dbSecret.secretArn],
    });

    //bastion host access rds
    const { ec2 } = new BastionHost(this, "BastionHost", {vpc,securityGroup:proxySG});
    
    //APIProxy
    const { lambda: apiProxyHandler } = new LambdaAPIProxy(
      this,
      "APIProxy",
      vpc
    );

    const { lambda: extractHandler } = new LambdaExtractProcess(
      this,
      "ExtractProcess",
      vpc
    );

    const restApi = new LambdaRestApi(this, "BlogRestApi", {
      restApiName: "BlogRestApi",
      proxy: true,
      endpointConfiguration: {
        types: [EndpointType.EDGE],
      },
      defaultCorsPreflightOptions: {
        allowOrigins: gateway.allowOrigins
      },      
      handler: apiProxyHandler,
      deploy: true,
    });

    /**
     * source bucket S3
     */
    const sourceBucket = new Bucket(this, "StaticWebSite", {
      removalPolicy: RemovalPolicy.DESTROY,  
      autoDeleteObjects: true
    });

    /**
     * blog bucket S3
     */
    const { bucket: blogBucket } = new NotifyBlogBucket(this, "NotifyBucket", {
      target: extractHandler,
    });

    //set proxy endpoint env for lambda connection
    proxy.grantConnect(apiProxyHandler);
    apiProxyHandler.addToRolePolicy(readWriteRDSPolicy);
    apiProxyHandler.addToRolePolicy(readSSMPolicy);
    apiProxyHandler.addEnvironment("endpoint", proxy.endpoint);
    apiProxyHandler.addEnvironment("secret", dbSecret.secretName);
    apiProxyHandler.addEnvironment("username", "admin");
    apiProxyHandler.addEnvironment("dbname", databaseName);
    //set proxy endpoint env for lambda connection
    proxy.grantConnect(extractHandler);
    extractHandler.addToRolePolicy(readWriteRDSPolicy);
    extractHandler.addToRolePolicy(readSSMPolicy);
    extractHandler.addEnvironment("endpoint", proxy.endpoint);
    extractHandler.addEnvironment("secret", dbSecret.secretName);
    extractHandler.addEnvironment("username", "admin");
    extractHandler.addEnvironment("dbname", databaseName);

    //WEB
    const hostedZone = HostedZone.fromLookup(this, "HostZone", {
      domainName: domainName,
    });

    const { distribution } = new WebFront(this, "WebDistribution", {
      hostedZone,
      htmlSourceBucket: sourceBucket,
      blogBucket: blogBucket,
      restApi,
    });

    //CloudFront
    new ARecord(this, "AliasRecordSet", {
      recordName: domainName,
      zone: hostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });

    /**
     * Bucket Name are stored  in Parameter Store for public access
     * Github Action will use it to push html or markdown resource
     */
    new StringParameter(this, "BlogBucketName", {
      stringValue: blogBucket.bucketName,
      parameterName: ssm.blogBucket,
    });
    new StringParameter(this, "WebBucketName", {
      stringValue: sourceBucket.bucketName,
      parameterName: ssm.htmlBucket,
    });
    new StringParameter(this,"SSMWebDistibutionID",{
      stringValue: distribution.distributionId,
      parameterName: ssm.distribution
    })
  }
}
