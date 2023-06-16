/**
 * create cdk pipeline
 * to cdk synth && cdk deploy on server
 * 
 * when deploy ends, set cloudwatch alarm to notify me.
 */

import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export class CDKPipelineStack extends Stack{
  constructor(scope:Construct,id:string,props?:StackProps){
    super(scope,id,props)

    
  }
}