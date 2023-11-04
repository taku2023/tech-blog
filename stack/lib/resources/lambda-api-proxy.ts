import { IVpc, SubnetType } from "aws-cdk-lib/aws-ec2";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";

export class LambdaAPIProxy extends Construct {
  public readonly lambda: Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.lambda = new Function(this, "LambdaApiProxy", {
      runtime: Runtime.GO_1_X,
      code: Code.fromAsset(path.join(__dirname, "../../../lambda/api"), {
        bundling: {
          image: Runtime.GO_1_X.bundlingImage,
          user: "root",
          command: [
            "bash",
            "-c",
            [
              "cd /asset-input",
              "GOOS=linux GOARCH=amd64 go build -o main main.go",
              "mv /asset-input/main /asset-output",
            ].join(" && "),
          ],
        },
      }),
      handler: "main",
    });
  }
}
