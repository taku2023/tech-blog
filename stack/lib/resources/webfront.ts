import { RestApi } from "aws-cdk-lib/aws-apigateway";
import {
  CertificateValidation,
  DnsValidatedCertificate,
} from "aws-cdk-lib/aws-certificatemanager";
import {
  CloudFrontWebDistribution,
  Distribution,
  HttpVersion,
  OriginAccessIdentity,
  OriginRequestPolicy,
  PriceClass,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { RestApiOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { appContext } from "../../bin/config";

interface OriginSourceProps {
  htmlSourceBucket: IBucket;
  blogBucket: IBucket;
  restApi: RestApi;
  logBucket?: IBucket;
}

export class WebFront extends Construct {
  constructor(scope: Construct, id: string, props: OriginSourceProps) {
    super(scope, id);
    const {
      domainName,
      region,
      cloudflont: { priceClass },
    } = appContext(this);

    const hostedZone = HostedZone.fromLookup(this, "HostZone", {
      domainName: domainName,
    });
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

    CloudFrontWebDistribution;
    const distribution = new Distribution(this, "CloudFrontDist", {
      enabled: true,
      httpVersion: HttpVersion.HTTP2,
      priceClass: PriceClass.PRICE_CLASS_100,
      domainNames: [domainName],
      defaultBehavior: {
        origin: new S3Origin(props.htmlSourceBucket, {
          originShieldRegion: region,
          originAccessIdentity: new OriginAccessIdentity(
            this,
            "CloudFrontOriginAccessIdentity",
            {}
          ),
        }),
        compress: true,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      additionalBehaviors: {
        blogs: {
          origin: new S3Origin(props.blogBucket, {
            originPath: "blog",
            originAccessIdentity: new OriginAccessIdentity(
              this,
              "CloudFrontOriginAccessIdentityForBlog"
            ),
          }),
          compress: true,
        },
        api: {          
          origin: new RestApiOrigin(props.restApi,{            
          }),
          originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,          
          compress: true,
        },
      },
      certificate: certification,
      enableIpv6: true,
      defaultRootObject: "index.html",
    });
  }
}
