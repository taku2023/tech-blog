import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  InterfaceVpcEndpointAwsService,
  IpAddresses,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { appContext } from "../bin/config";

export class VPCStack extends Stack {
  public readonly vpc: Vpc;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const context = appContext(this);
    //VPC + subnet-group
    //public for bastion ec2
    //private for lambda,rds
    this.vpc = new Vpc(this, "WebApi-VPC", {
      maxAzs: 2,
      ipAddresses: IpAddresses.cidr("10.0.0.0/22"),
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "public-subnet-gp",
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: "private-subnet-gp",
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    this.addInterfaceEndpoint(this.vpc);

    new CfnOutput(this, "VPCOutput", {
      exportName: "vpcId",
      value: this.vpc.vpcId,
    });
  }

  private addInterfaceEndpoint(vpc: Vpc) {
    vpc.addInterfaceEndpoint("APIGatewayEndpoint", {
      service: InterfaceVpcEndpointAwsService.APIGATEWAY,
      subnets: {
        subnetGroupName: "private-subnet-gp",
      },
    });

    vpc.addInterfaceEndpoint("SecretManagerEndpoint", {
      service: InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: {
        subnetGroupName: "private-subnet-gp",
      },
    });
  }
}
