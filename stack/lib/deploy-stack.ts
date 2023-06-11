import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import {
  CloudFrontWebDistribution,
  PriceClass,
  ViewerCertificate,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";

import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const { accountId, region } = new cdk.ScopedAws(this);
    console.log(accountId)
    const domainName = this.node.tryGetContext("domainName");
    /**
     * API Server
     * APIGateway -> Lambda -> DynamoDB
     *               Lambda -> Github(Article Fetch)
     *
     * Hosting Server
     * CF -> S3 (Geo routeing+Route53 HostZone)
     * CF -> Route53 -> ALB(+ACM) -> EC2
     *
     * Article Hosting
     * Github
     */

    /**
     * source bucket S3
     */
    const sourceBucket = new Bucket(this, "StaticWebSite", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: "moritakuaki-teckblog",
    });

    const hostedZone = cdk.aws_route53.HostedZone.fromLookup(this, "HostZone", {
      domainName: domainName,
    });
    //acm
    //ACM設定（cloudfront）
    const certification = new acm.DnsValidatedCertificate(
      this,
      "CertificateManager",
      {
        domainName,
        hostedZone,
        region: "us-east-1", //変更しない
        validation: acm.CertificateValidation.fromDns(hostedZone),
      }
    );

    const distribution = new CloudFrontWebDistribution(
      this,
      "CloudFrontWebDist",
      {
        priceClass: PriceClass.PRICE_CLASS_100,
        enabled: true,
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: sourceBucket,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
              },
            ],
          },
        ],
        viewerCertificate: ViewerCertificate.fromAcmCertificate(certification),
        viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
        defaultRootObject: "index.html",

        //geoRestriction:GeoRestriction.denylist()
      }
    );

    //CloudFrontにルーティング設定
    new cdk.aws_route53.ARecord(this, "AliasRecordSet", {
      recordName: domainName,
      zone: hostedZone,
      target: cdk.aws_route53.RecordTarget.fromAlias(
        new CloudFrontTarget(distribution)
      ),
    });

    //s3クロススタック参照のためのエクスポート
    new cdk.CfnOutput(this, "StaticWebsiteBucketOutput", {
      value: sourceBucket.bucketArn,
      exportName: "StaticWebsiteBucketArn",
    });
  }
}
