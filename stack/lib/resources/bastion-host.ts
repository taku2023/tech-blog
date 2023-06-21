import { aws_ec2 } from "aws-cdk-lib";
import {
  IVpc,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
  Peer,
  SecurityGroup,
  SubnetType,
  UserData,
} from "aws-cdk-lib/aws-ec2";
import {
  CfnInstanceProfile,
  ManagedPolicy,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { DatabaseInstance } from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";

export class BastionHost extends Construct {
  public readonly ec2: Instance;
  //private readonly vpc: IVpc;

  constructor(scope: Construct, id: string, vpc: IVpc) {
    super(scope, id);

    /*const securityGroup = new SecurityGroup(this, "SSM_SecurityGroup", {
      vpc,
      allowAllOutbound: true,    
    });*/

    const role = new Role(this, "EC2AccessSSMRole", {
      assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore"),
      ],
    });

    new CfnInstanceProfile(this, `SSMIntanceProfile`, {
      roles: [role.roleName],
    });

    //ssm is pre installed on amazon linux 2
    //so we only have to launch it
    const userData = UserData.forLinux();
    userData.addCommands(
      "sudo systemctl status amazon-ssm-agent",
      "sudo systemctl enable amazon-ssm-agent",
      "sudo systemctl start amazon-ssm-agent",
      "sudo yum install mysql"
    );

    this.ec2 = new Instance(this, "BastionHostEC2", {
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
      machineImage: MachineImage.latestAmazonLinux({
        generation: aws_ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        userData,
      }),
      role,
    });

    //this.vpc = vpc;
  }
}
