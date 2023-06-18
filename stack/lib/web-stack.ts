import * as cdk from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { DatabaseProxy } from "aws-cdk-lib/aws-rds";
import { ARecord, HostedZone } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { appContext } from "../bin/config";
import { ExtractProcess } from "./resources/extract-blog";
import { NotifyBlogBucket } from "./resources/s3-blog";
import { WebFront } from "./resources/webfront";

interface ShareResourceProps {
  restApi: RestApi;
  vpc: IVpc;
  proxy: DatabaseProxy;
}

export class WebStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    { restApi, vpc, proxy }: ShareResourceProps,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);
    const { accountId, region } = new cdk.ScopedAws(this);
    const { domainName, ssm } = appContext(this);
    /**
     * source bucket S3
     */
    const sourceBucket = new Bucket(this, "StaticWebSite", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publicReadAccess: false,
      autoDeleteObjects: true,
    });

    /**
     * blog bucket s3
     */
    const { queue, bucket: blogBucket } = new NotifyBlogBucket(
      this,
      "notifyBucket"
    );
    const { lambda } = new ExtractProcess(this, "extractProcess", vpc);
    new SqsEventSource(queue).bind(lambda);
    //queue.grantConsumeMessages(lambda);
    //proxy
    proxy.grantConnect(lambda);
    lambda.addToRolePolicy(
      new PolicyStatement({
        actions: ["rds-db:connect"],
        resources: [proxy.dbProxyArn],
      })
    );

    const hostedZone = HostedZone.fromLookup(this, "HostZone", {
      domainName: domainName,
    });

    const { distribution } = new WebFront(this, "WebDistribution", {
      hostedZone,
      htmlSourceBucket: sourceBucket,
      blogBucket: blogBucket,
      restApi,
    });

    //CloudFrontにルーティング設定
    new ARecord(this, "AliasRecordSet", {
      recordName: domainName,
      zone: hostedZone,
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new CloudFrontTarget(distribution)
      ),
    });

    //*****OUTPUT*****
    //blog bucket
    new StringParameter(this, "BlogBucketName", {
      stringValue: blogBucket.bucketName,
      parameterName: ssm.blogBucket,
    });
    //source bucket
    new StringParameter(this, "WebBucketName", {
      stringValue: sourceBucket.bucketName,
      parameterName: ssm.htmlBucket,
    });
  }
}
