import { ScopedAws } from "aws-cdk-lib";
import { PriceClass } from "aws-cdk-lib/aws-cloudfront";
import { Construct } from "constructs";

type Stage = {
  cloudflont: {
    priceClass: PriceClass;
  };
  rds: {
    databaseName: string;
  };
};

type AppProps = {
  domainName: string;
  accountId: string;
  region: string;
} & Stage;

export const appContext = (app: Construct): AppProps => {
  const mode = app.node.getContext("mode");
  const { accountId, region } = new ScopedAws(app);

  return {
    domainName: "moritakuaki.com",
    region,
    accountId,
    cloudflont: {
      priceClass: PriceClass.PRICE_CLASS_100,
    },
    rds: {
      databaseName: `blog_${mode}`,
    },
  };
};
