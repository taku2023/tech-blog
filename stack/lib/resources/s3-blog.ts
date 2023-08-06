import { RemovalPolicy } from "aws-cdk-lib";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Bucket, IBucket } from "aws-cdk-lib/aws-s3";
import { LambdaDestination } from "aws-cdk-lib/aws-s3-notifications";
import { Construct } from "constructs";

interface SharedResources {
  target: IFunction;
}

export class NotifyBlogBucket extends Construct {
  public readonly bucket: IBucket;
  //public readonly queue: Queue;

  constructor(scope: Construct, id: string, props: SharedResources) {
    super(scope, id);
    const s3Bcuket = new Bucket(this, "BlogBucket", {
      removalPolicy: RemovalPolicy.DESTROY
    });

    s3Bcuket.addObjectCreatedNotification(new LambdaDestination(props.target),{
      suffix: 'md'
    });
    s3Bcuket.addObjectRemovedNotification(new LambdaDestination(props.target),{
      suffix: "md"
    });
    s3Bcuket.grantRead(props.target)
    
    this.bucket = s3Bcuket;
  }
}
