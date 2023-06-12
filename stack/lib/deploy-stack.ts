import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { PriceClass } from "aws-cdk-lib/aws-cloudfront";
import * as cforigin from "aws-cdk-lib/aws-cloudfront-origins";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const { accountId, region } = new cdk.ScopedAws(this);
    const domainName = this.node.tryGetContext("domainName");
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

    const distribution = new cloudfront.Distribution(this, "CloudFrontDist", {
      enabled: true,
      httpVersion: cloudfront.HttpVersion.HTTP2,
      priceClass: PriceClass.PRICE_CLASS_100,
      domainNames: [domainName],
      defaultBehavior: {
        origin: new cforigin.S3Origin(sourceBucket, {
          originShieldRegion: region,
          originAccessIdentity: new cloudfront.OriginAccessIdentity(
            this,
            "CloudFrontOriginAccessIdentity"
          ),
        }),
        compress: true,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      certificate: certification,
      enableIpv6: true,
      defaultRootObject: "index.html",
    });

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
