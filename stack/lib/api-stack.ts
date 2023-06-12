import { ScopedAws, Stack, StackProps } from "aws-cdk-lib";
import { Cors, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { Code, Function, Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";

export class APIStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const { accountId, region } = new ScopedAws(this);

    /**
     * RestApi
     * APIGateway -> Lambda -> Athena -> S3(where blog house)
     */

    const lambdaFunction = new Function(this, "handler", {
      runtime: Runtime.GO_1_X,
      code: Code.fromAsset(path.join(__dirname, "../../server")),
      handler: "entry",
      tracing: Tracing.ACTIVE,
    });

    const restApi = new LambdaRestApi(this, "GoLambda", {
      restApiName: "blog",
      proxy: true,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
      },
      handler: lambdaFunction,
    });
  }
}

//takuaki-blog-content
