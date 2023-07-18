import { ScopedAws } from "aws-cdk-lib";
import { Cors } from "aws-cdk-lib/aws-apigateway";
import { CachePolicy, ICachePolicy, PriceClass } from "aws-cdk-lib/aws-cloudfront";
import { Construct } from "constructs";

type Stage = {
  mode: "dev" | "prod";
  cloudflont: {
    priceClass: PriceClass;
    cachePolicy: ICachePolicy
  };
  rds: {
    databaseName: string;
    iamAuthentication?:boolean
  };
  gateway:{
    allowOrigins: string[] 
  },
  ssm: {
    htmlBucket: string;
    blogBucket: string;
  };
};

type AppProps = {
  domainName: string;
  accountId: string;
  region: string;
} & Stage;

export const appContext = (app: Construct): AppProps => {
  const mode = app.node.getContext("mode") as 'dev'|'prod';
  const { accountId, region } = new ScopedAws(app);
  const domainName = 'moritakuaki.com'

  return {
    mode,
    domainName,
    region,
    accountId,
    cloudflont: {
      priceClass: PriceClass.PRICE_CLASS_100,
      cachePolicy: CachePolicy.CACHING_OPTIMIZED
    },
    rds: {
      databaseName: `blog_${mode}`,
      iamAuthentication: mode == 'dev'
    },
    gateway:{
      //allowOrigins: mode == 'dev' ? Cors.ALL_ORIGINS : [domainName]
      allowOrigins: [domainName]
    },
    ssm: {
      htmlBucket: "/tech-blog/buckets/source-bucket",
      blogBucket: "/tech-blog/buckets/blog-bucket",
    },
  };
};
