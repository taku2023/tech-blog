import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { appContext } from './../bin/config';
import { ExtractProcess } from "./resources/extract-blog";
import { NotifyBlogBucket } from "./resources/s3-blog";

export class BlogStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const context =appContext(this);

    const { queue } = new NotifyBlogBucket(this, "notifyBucket");
    const { lambda } = new ExtractProcess(this, "extractProcess");
    queue.grantConsumeMessages(lambda);    
  }
}
