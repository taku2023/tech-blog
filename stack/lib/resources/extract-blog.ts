import { SecurityGroup } from "aws-cdk-lib/aws-ec2";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";
/**
 * this lambda function extract summary from blog
 */
export class ExtractProcess extends Construct {

  public readonly lambda:Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);
        
    this.lambda = new Function(this, "lambdaExtract", {
      handler: "main",
      runtime: Runtime.GO_1_X,      
      securityGroups:[],
      code: Code.fromAsset(path.join(__dirname, "../../../api/notification"), {
        bundling: {
          image: Runtime.GO_1_X.bundlingImage,
          user: "root",
          command: [
            "bash",
            "-c",
            [
              "cd /asset-input",
              "go build -o main main.go",
              "mv /asset-input/main /asset-output",
            ].join(" && "),
          ],
        },
      }),
    });        
  }
}

