import { RemovalPolicy } from "aws-cdk-lib";
import { Bucket, NotificationKeyFilter } from "aws-cdk-lib/aws-s3";
import { SqsDestination } from "aws-cdk-lib/aws-s3-notifications";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export interface NotifyBucketProps  {
  blog_filter?: NotificationKeyFilter;
}

export class NotifyBlogBucket extends Construct {
  public readonly bucketName: string;
  public readonly queue: Queue;

  constructor(scope: Construct, id: string, props?: NotifyBucketProps) {
    super(scope, id);
    const s3Bcuket = new Bucket(this, "bucket", {
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.queue = new Queue(this, "queue", {
      fifo: true,
    });

    const filter: NotificationKeyFilter = props?.blog_filter ?? {
      prefix: "blogs/",
      suffix: ".md",
    };

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

    this.bucketName = s3Bcuket.bucketName;
  }
}
