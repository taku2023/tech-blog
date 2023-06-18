import { IVpc, SubnetType } from "aws-cdk-lib/aws-ec2";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";

export class LambdaAPIProxy extends Construct {
  public readonly lambda: Function;

  constructor(scope: Construct, id: string, vpc: IVpc) {
    super(scope, id);
    this.lambda = new Function(this, "handler", {
      runtime: Runtime.GO_1_X,
      code: Code.fromAsset(path.join(__dirname, "../../../lambda/api"), {
        bundling: {
          image: Runtime.GO_1_X.bundlingImage,
          environment: {
            CGO_ENABLED: "0",
            GOOS: "linux",
            GOARCH: "amd64",
          },
          user: "root",
          command: [
            "bash",
            "-c",
            ["make vendor", "make lambda-build"].join(" && "),
          ],
        },
      }),
      handler: "main",
      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
    });
  }
}
