import { RestApi } from "aws-cdk-lib/aws-apigateway";
import {
  CertificateValidation,
  DnsValidatedCertificate,
} from "aws-cdk-lib/aws-certificatemanager";
import {
  Distribution,
  HttpVersion,
  IDistribution,
  OriginAccessIdentity,
  OriginRequestPolicy,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { RestApiOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { appContext } from "../../bin/config";

interface OriginSourceProps {
  hostedZone: IHostedZone;
  htmlSourceBucket: IBucket;
  blogBucket: IBucket;
  restApi: RestApi;
  logBucket?: IBucket;
}

export class WebFront extends Construct {
  public readonly distribution: IDistribution;

  constructor(
    scope: Construct,
    id: string,
    { hostedZone, htmlSourceBucket, blogBucket, restApi }: OriginSourceProps
  ) {
    super(scope, id);
    const {
      domainName,
      region,
      cloudflont: { priceClass },
    } = appContext(this);

    //acm
    //ACM設定（cloudfront）
    const certification = new DnsValidatedCertificate(
      this,
      "CertificateManager",
      {
        domainName,
        hostedZone,
        region: "us-east-1", //変更しない
        validation: CertificateValidation.fromDns(hostedZone),
      }
    );

    this.distribution = new Distribution(this, "CloudFrontDist", {
      enabled: true,
      httpVersion: HttpVersion.HTTP2,
      priceClass,
      domainNames: [domainName],
      defaultBehavior: {
        origin: new S3Origin(htmlSourceBucket, {
          originShieldRegion: region,
          originAccessIdentity: new OriginAccessIdentity(
            this,
            "CloudFrontOriginAccessIdentity"
          ),
        }),
        compress: true,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      additionalBehaviors: {
        blogs: {
          origin: new S3Origin(blogBucket, {            
            originPath: "blog",
            originAccessIdentity: new OriginAccessIdentity(
              this,
              "CloudFrontOriginAccessIdentityForBlog"
            ),
          }),
          compress: true,
        },
        api: {
          origin: new RestApiOrigin(restApi),
          originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,
          compress: true,
        },
      },
      certificate: certification,
      enableIpv6: true,
    });
  }
}
