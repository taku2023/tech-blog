import { ScopedAws } from "aws-cdk-lib";
import { PriceClass } from "aws-cdk-lib/aws-cloudfront";
import { Construct } from "constructs";

type Stage = {
  mode: "dev" | "prod";
  cloudflont: {
    priceClass: PriceClass;
  };
  rds: {
    databaseName: string;
    iamAuthentication?:boolean
  };
  queue: {};
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

  return {
    mode,
    domainName: "moritakuaki.com",
    region,
    accountId,
    cloudflont: {
      priceClass: PriceClass.PRICE_CLASS_100,
    },
    queue: {},
    rds: {
      databaseName: `blog_${mode}`,
      iamAuthentication: mode == 'dev'
    },
    ssm: {
      htmlBucket: "/tech-blog/buckets/source-bucket",
      blogBucket: "/tech-blog/buckets/blog-bucket",
    },
  };
};
