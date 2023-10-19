import { Stack, StackProps } from "aws-cdk-lib";
import {
  FlowLog,
  FlowLogDestination,
  FlowLogResourceType,
  GatewayVpcEndpointAwsService,
  IpAddresses,
  SubnetType,
  Vpc
} from "aws-cdk-lib/aws-ec2";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { appContext } from "../bin/config";

export class VPCStack extends Stack {
  public readonly vpc: Vpc;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const context = appContext(this);
    this.vpc = new Vpc(this, "MyVPC", {
      maxAzs: 2,
      ipAddresses: IpAddresses.cidr("10.1.0.0/16"),     
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "PrivateSubnetGroup",
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
        {
          cidrMask: 24,
          name: "PublicSubnetGroup",
          subnetType: SubnetType.PUBLIC,          
        },
      ],
    });
    if (context.mode == "dev") {
      this.enableVPCLog(this.vpc);
    }

    this.addEndpoint(this.vpc);
    
    this.vpc.publicSubnets.forEach(subnet=>this.exportValue(subnet.subnetId))
    this.vpc.privateSubnets.forEach(subnet=>this.exportValue(subnet.subnetId))
  }

  private enableVPCLog(vpc: Vpc) {
    const role = new Role(this, "CaptureLogRole", {
      assumedBy: new ServicePrincipal("vpc-flow-logs.amazonaws.com"),
    });
    const logGroup = new LogGroup(this, "VPCLogGroup");

    new FlowLog(this, "FlowLog", {
      resourceType: FlowLogResourceType.fromVpc(vpc),
      destination: FlowLogDestination.toCloudWatchLogs(logGroup, role),
    });
  }

  private addEndpoint(vpc: Vpc) { 
    /**
     * For S3 access
     */
    vpc.addGatewayEndpoint("S3BucketEndpoint", {
      service: GatewayVpcEndpointAwsService.S3,
      subnets: [
        {
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });
  }
}
