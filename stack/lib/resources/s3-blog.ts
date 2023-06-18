import { RemovalPolicy } from "aws-cdk-lib";
import { Bucket, IBucket, NotificationKeyFilter } from "aws-cdk-lib/aws-s3";
import { SqsDestination } from "aws-cdk-lib/aws-s3-notifications";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export interface NotifyBucketProps {
  blog_filter?: NotificationKeyFilter;
}

export class NotifyBlogBucket extends Construct {
  public readonly bucket: IBucket;
  public readonly queue: Queue;

  constructor(scope: Construct, id: string, props?: NotifyBucketProps) {
    super(scope, id);
    const s3Bcuket = new Bucket(this, "bucket", {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.queue = new Queue(this, "queue");

    const filter: NotificationKeyFilter = props?.blog_filter ?? {
      prefix: "blogs/",
      suffix: ".md",
    };

    /*s3Bcuket.addToResourcePolicy(
      new PolicyStatement({
        actions: ["SNS:Publish"],
        resources: [this.queue.queueArn],
      })
    );*/

    //creation notify
    s3Bcuket.addObjectCreatedNotification(
      new SqsDestination(this.queue),
      filter
    );

    //deletion notify
    s3Bcuket.addObjectRemovedNotification(
      new SqsDestination(this.queue),
      filter
    );

    this.bucket = s3Bcuket;
  }
}
