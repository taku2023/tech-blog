import { aws_ec2 } from "aws-cdk-lib";
import {
  IVpc,
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
  UserData,
} from "aws-cdk-lib/aws-ec2";
import {
  CfnInstanceProfile,
  ManagedPolicy,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
//import {} from "aws-cdk-lib/aws-man"


export class BastionHost extends Construct {
  constructor(scope: Construct, id: string, vpc : IVpc) {
    super(scope, id);

    /*const securityGroup = new SecurityGroup(this, "SSM_SecurityGroup", {
      vpc,
      allowAllOutbound: true,
    });*/
    const role = new Role(this, "EC2RoleForAccessSSM", {
      assumedBy: new ServicePrincipal("ec2.amazonaws.com", {
        /**condition */
      }),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AmazonEC2ContainerServiceforEC2Role"
        ),
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AmazonEC2RoleforSSM"
        ),
      ],
    });

    new CfnInstanceProfile(this, `InstanceProfileForEC2`, {
      roles: [role.roleName],
    });

    //ssm is pre installed on amazon linux 2
    //so we only have to launch it
    const userData = UserData.forLinux();
    userData.addCommands(
      "sudo systemctl status amazon-ssm-agent",
      "sudo systemctl enable amazon-ssm-agent",
      "sudo systemctl start amazon-ssm-agent"
    );

    const ec2 = new aws_ec2.Instance(this, "BastionHostEC2", {
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      vpc,
      machineImage: MachineImage.latestAmazonLinux({
        generation: aws_ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        userData,
      }),
      //securityGroup,
      role,
    });
  }
}
