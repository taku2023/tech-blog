import { RestApi } from "aws-cdk-lib/aws-apigateway";
import {
  CertificateValidation,
  DnsValidatedCertificate,
} from "aws-cdk-lib/aws-certificatemanager";
import {
  AllowedMethods,
  CachePolicy,
  CachedMethods,
  Distribution,
  HttpVersion,
  IDistribution,
  LambdaEdgeEventType,
  OriginAccessIdentity,
  ViewerProtocolPolicy,
  experimental,
} from "aws-cdk-lib/aws-cloudfront";
import { RestApiOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import * as path from "path";
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

    //acm(certificate domain)
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

    //lambda-edge only support nodejs or python
    //change request after path pattern matching  
    const edge = new experimental.EdgeFunction(this,"PassBehaviorLamda",{      
      code: Code.fromAsset(path.join(__dirname,"../../../lambda/edge")),
      runtime: Runtime.NODEJS_14_X,
      handler: "index.handler",
    })

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
            "CloudFrontOriginAccessIdentity",
            {
              comment: "Allow cloudfront to react react source bucket",
            }
          ),
        }),
        compress: true,
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: CachedMethods.CACHE_GET_HEAD,
      },
      additionalBehaviors: {
        "/__blogs__/*": {
          origin: new S3Origin(blogBucket, {
            originAccessIdentity: new OriginAccessIdentity(
              this,
              "CloudFrontOriginAccessIdentityForBlog",
              {
                comment: "Allow cloudfront to react blog bucket",
              }
            ),
          }),
          edgeLambdas: [
            {
              functionVersion: edge.currentVersion,
              eventType: LambdaEdgeEventType.VIEWER_REQUEST
            }
          ],
          compress: true,
          cachePolicy: CachePolicy.CACHING_OPTIMIZED,
          allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachedMethods: CachedMethods.CACHE_GET_HEAD
        },
        "/__api__/*": {
          origin: new RestApiOrigin(restApi),
          compress: true,
          allowedMethods: AllowedMethods.ALLOW_ALL,
          edgeLambdas: [
            {
              functionVersion: edge.currentVersion,
              eventType: LambdaEdgeEventType.VIEWER_REQUEST
            }
          ],
        },
      },
      certificate: certification,
      defaultRootObject: "index.html",
    });
  }
}
