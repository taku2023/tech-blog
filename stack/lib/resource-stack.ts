import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { EndpointType, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { appContext } from "../bin/config";
import { LambdaExtractProcess } from "./resources/extract-blog";
import { LambdaAPIProxy } from "./resources/lambda-api-proxy";
import { NotifyBlogBucket } from "./resources/s3-blog";
import { WebFront } from "./resources/webfront";
import {MyTable} from "./resources/dynamo"

export class ResourceStack extends Stack {
  
  constructor(
    scope: Construct,
    id: string,
    props?: StackProps
  ) {
    super(scope, id, props);
    const { domainName, ssm,gateway } = appContext(this);

    //const athena = new AthenaDatabase(this,"AthenaDatabase")
    const {table} = new MyTable(this,"DynamoDBTable")
    
    //APIProxy
    const { lambda: apiProxyHandler } = new LambdaAPIProxy(
      this,
      "APIProxy",
    );

    //extract blog info from sourcebucket
    const { lambda: extractHandler } = new LambdaExtractProcess(
      this,
      "ExtractProcess",
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

    extractHandler.addEnvironment('tablename',table.tableName)
    table.grantReadWriteData(extractHandler)
    apiProxyHandler.addEnvironment("tablename",table.tableName)
    table.grantReadData(apiProxyHandler)

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
