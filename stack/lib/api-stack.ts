import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class APIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * API Server
     * APIGateway -> Lambda -> DynamoDB
     *               Lambda -> Github(Article Fetch)
     * 
     * Hosting Server
     * CF -> S3 (Geo routeing+Route53 HostZone) 
     * CF -> Route53 -> ALB(+ACM) -> EC2
     * 
     * Article Hosting
     * Github
     */

 

    // example resource
    // const queue = new sqs.Queue(this, 'StackQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}


